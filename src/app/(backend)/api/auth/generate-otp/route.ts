import { connectMongoDB } from "@/mongodb/connectDB";
import SignInVerificationSessionModel from "@/mongodb/models/SignInVerification.model";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";

interface reqBodyI {
    email: string;
}

function generateRandomOTP(length: number = 6) {
    let otp = "";

    while (otp.length < length) {
        const randomInt = Math.round(Math.random() * 9);
        otp += randomInt;
    };

    return otp;
}

export async function POST(req: NextRequest) {
    try {

        await connectMongoDB();

        const body = await req.json();

        const user = await UserAuthModel.findOne({
            userEmail: body.email,
            isActive: true,
            isDeleted: false,
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "No account is registered with this email. Please register first to continue." }, { status: 400 });
        };

        const currentUserActiveSession = await SignInVerificationSessionModel.findOne({
            userId: user._id,
            isActive: true,
            isDeleted: false,
        });

        if (currentUserActiveSession) {
            const expired = currentUserActiveSession.expiredOn < new Date();

            if (!expired) {
                currentUserActiveSession.isActive = false;
                currentUserActiveSession.isDeleted = true;
                currentUserActiveSession.save();
            } else {
                return NextResponse.json({ success: true, expiredOn: currentUserActiveSession.expiredOn }, { status: 200 });
            }
        }

        const activeOtps = await SignInVerificationSessionModel.find({
            isActive: true,
            isDeleted: false,
        }).select("otp").lean<string[]>();

        console.log("activeOtps", activeOtps);

        let newOtp: string | null = null;

        while (!newOtp || activeOtps.includes(newOtp || "")) {
            newOtp = generateRandomOTP();
        };

        const newSignInVerificationData = await SignInVerificationSessionModel.create({
            userId: user._id,
            email: user.userEmail,
            otp: newOtp,
            createdOn: new Date(),
            expiredOn: new Date(Date.now() + 10 * 60 * 1000),
        });

        console.log("newSignInVerificationData", newSignInVerificationData);

        return Response.json({ success: true, message: `Verification OTP has been successfully sent to ${user.userEmail}` }, { status: 200 });
    } catch (error) {
        console.log("Something went wrong in /api/auth/signin/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}