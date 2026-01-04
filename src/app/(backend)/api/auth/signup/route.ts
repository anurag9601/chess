import { generateJWT, generateJWTDataType } from "@/lib/jsonWebtoken";
import { connectMongoDB } from "@/mongodb/connectDB";
import EmailVerificationModel from "@/mongodb/models/EmailVerification.model";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import UserFriendModel from "@/mongodb/models/UserFriend.model";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

interface reqBodyI {
    fName: string;
    lName: string;
    userEmail: string;
    uniqueUserName: string;
}

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const body: reqBodyI = await req.json();

        const isUserAlreadyExist = await UserAuthModel.findOne({
            $or: [
                { userEmail: body.userEmail },
                { uniqueUserName: body.uniqueUserName }
            ]
        });

        if (isUserAlreadyExist) {
            return NextResponse.json({ success: false, error: "User name or Email is already registered." }, { status: 400 });
        };

        const newUser = await UserAuthModel.create({
            fName: body.fName,
            lName: body.lName,
            userEmail: body.userEmail.replace(/\s+/g, ""),
            uniqueUserName: body.uniqueUserName.replace(/\s+/g, ""),
        });

        if (newUser) {
            await UserFriendModel.create({
                userId: newUser._id
            });
        }

        const uuid = uuidv4();

        const userEmailVerificationMapping = await EmailVerificationModel.create({
            uuid: uuid as string,
            userId: newUser._id as string
        });

        const requestToSendEmailVerificationMail = await fetch(`${process.env.APPLICATION_URL}/api/email/emailVerification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName: `${newUser.fName} ${newUser.lName}`,
                sendTo: newUser.userEmail,
                verifyLink: `${process.env.APPLICATION_URL}/${userEmailVerificationMapping.uuid}`,
            })
        });

        const responseOfSendEmailVerificationMail = await requestToSendEmailVerificationMail.json();

        const tokenPayload: generateJWTDataType = {
            fName: newUser.fName,
            lName: newUser.lName,
            userEmail: newUser.userEmail,
            uniqueUserName: newUser.uniqueUserName,
            isEmailVerified: newUser.isEmailVerified
        };

        const token = generateJWT(tokenPayload);

        const response = NextResponse.json({ success: true, message: "🎉 Congratulations! Your registration has been successfully completed.", data: tokenPayload }, { status: 200 });

        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 90 * 24 * 60 * 60,
        });

        return response;

    } catch (error) {
        console.log("Something went wrong in /api/auth/signup/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}