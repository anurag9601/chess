import { generateJWT, generateJWTDataType } from "@/lib/jsonWebtoken";
import { connectMongoDB } from "@/mongodb/connectDB";
import EmailVerificationModel from "@/mongodb/models/EmailVerification.model";
import SignInVerificationSessionModel from "@/mongodb/models/SignInVerification.model";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import UserFriendModel from "@/mongodb/models/UserFriend.model";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

interface reqBodyI {
    email: string;
    otp: string;
}

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const body: reqBodyI = await req.json();

        const availableSignInSession = await SignInVerificationSessionModel.findOne({
            email: body.email,
            isActive: true,
            isDeleted: false,
        });

        if (!availableSignInSession) {
            return NextResponse.json({ success: false, error: "You don’t have any active OTP session. Please generate a new OTP to continue." }, { status: 400 });
        }

        const validSession = availableSignInSession.expiredOn < new Date();

        if (!validSession) {
            availableSignInSession.isActive = false;
            availableSignInSession.isDeleted = true;
            availableSignInSession.save();

            return NextResponse.json({ success: false, error: "Your OTP has expired. Please generate a new OTP to continue." }, { status: 400 });
        }else if (availableSignInSession.otp !== body.otp) {
            return NextResponse.json({ success: false, error: "The OTP you entered is incorrect. Please enter the valid OTP sent to your email." }, { status: 400 });
        };

        const currentUser = await UserAuthModel.findOne({
            _id: availableSignInSession.userId
        });

        if (currentUser) {
            await UserFriendModel.create({
                userId: currentUser._id
            });
        }

        const uuid = uuidv4();

        const userEmailVerificationMapping = await EmailVerificationModel.create({
            uuid: uuid as string,
            userId: currentUser._id as string
        });

        const requestToSendEmailVerificationMail = await fetch(`${process.env.APPLICATION_URL}/api/email/emailVerification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName: `${currentUser.fName} ${currentUser.lName}`,
                sendTo: currentUser.userEmail,
                verifyLink: `${process.env.APPLICATION_URL}/${userEmailVerificationMapping.uuid}`,
            })
        });

        const responseOfSendEmailVerificationMail = await requestToSendEmailVerificationMail.json();

        const tokenPayload: generateJWTDataType = {
            _id: currentUser._id,
            fName: currentUser.fName,
            lName: currentUser.lName,
            userEmail: currentUser.userEmail,
            uniqueUserName: currentUser.uniqueUserName,
            isEmailVerified: currentUser.isEmailVerified
        };

        const token = generateJWT(tokenPayload);

        const response = NextResponse.json({ success: true, message: "🎉 Congratulations! Your signin process has been successfully completed.", data: tokenPayload }, { status: 200 });

        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 90 * 24 * 60 * 60,
        });

        return response;

    } catch (error) {
        console.log("Something went wrong in /api/auth/signin/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}