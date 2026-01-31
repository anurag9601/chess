import { generateJWT, generateJWTDataType } from "@/lib/jsonWebtoken";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";

interface reqBodI {
    userId: string;
    newUniqueUserName: string;
};

export async function POST(req: NextRequest) {
    try {
        const body: reqBodI = await req.json();

        const user = await UserAuthModel.findOne({ _id: body.userId });

        if (!user) {
            return Response.json(
                { success: false, error: "User not found." },
                { status: 404 }
            );
        }

        user.uniqueUserName = body.newUniqueUserName;
        await user.save();

        const tokenPayload: generateJWTDataType = {
            _id: user._id,
            fName: user.fName,
            lName: user.lName,
            userEmail: user.userEmail,
            uniqueUserName: user.uniqueUserName,
            isEmailVerified: user.isEmailVerified
        };

        const token = generateJWT(tokenPayload);

        const response = NextResponse.json({ success: true, message: "Congratulations!🎉 Your username has been updated successfully." }, { status: 200 });

        response.cookies.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 90 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        console.log("Something went wrong in /api/user/update/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}