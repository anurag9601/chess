import { connectMongoDB } from "@/mongodb/connectDB";
import SignInVerificationSessionModel from "@/mongodb/models/SignInVerification.model";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";

interface reqBodyI {
    emailOrUserName: string;
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

        const body: reqBodyI = await req.json();

        const user = await UserAuthModel.findOne({
            isActive: true,
            isDeleted: false,
            $or: [
                { userEmail: body.emailOrUserName },
                { uniqueUserName: body.emailOrUserName }
            ]
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "No account is registered with this email. Please register first to continue." }, { status: 400 });
        };

        const currentUserActiveSession = await SignInVerificationSessionModel.findOne({
            email: user.userEmail,
            isActive: true,
            isDeleted: false,
        });

        if (currentUserActiveSession) {
            const isExpired = currentUserActiveSession.expiredOn < new Date();

            if (!isExpired) {
                return NextResponse.json({ success: true, message: "An OTP has already been sent. Please enter it to sign in before it expires.", expiredOn: currentUserActiveSession.expiredOn }, { status: 200 });
            }

            currentUserActiveSession.isActive = false;
            currentUserActiveSession.isDeleted = true;
            await currentUserActiveSession.save();
        }

        let activeOtps = await SignInVerificationSessionModel.find({
            isActive: true,
            isDeleted: false,
        }).select("otp -_id");

        activeOtps = activeOtps.map((o) => o.otp);

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

        const requestToSendOTPEmail = await fetch(`${process.env.APPLICATION_URL}/api/email/sendOTP`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sendTo: user.userEmail,
                otp: newOtp,
                fName: user.fName,
                lName: user.lName,
                uniqueUserName: user.uniqueUserName,
            })
        });

        const responseOfSendOTPEmail = await requestToSendOTPEmail.json();

        return Response.json({ success: true, message: `A verification OTP has been successfully sent to your registered email address: ${user.userEmail}.`, expiredOn: newSignInVerificationData.expiredOn }, { status: 200 });
    } catch (error) {
        console.log("Something went wrong in /api/auth/generate-otp/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}