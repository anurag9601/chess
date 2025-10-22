import { generateJWT, generateJWTDataType } from "@/lib/jsonWebtoken";
import { connectMongoDB } from "@/mongodb/connectDB";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";

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
            userEmail: body.userEmail,
            uniqueUserName: body.uniqueUserName,
        });

        const tokenPayload: generateJWTDataType = {
            fName: newUser.fName,
            lName: newUser.lName,
            userEmail: newUser.userEmail,
            uniqueUserName: newUser.uniqueUserName,
        };

        const token = generateJWT(tokenPayload);

        const response = NextResponse.json({ success: true, message: "🎉 Congratulations! Your registration has been successfully completed." }, { status: 200 });

        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 90 * 24 * 60 * 60,
            path: "/"
        });

        return response;

    } catch (error) {
        console.log("Something went wrong in /api/auth/signup/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}