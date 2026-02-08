import { authorizeUserAuth } from "@/functions/backend/authFunction";
import { generateJWT, generateJWTDataType } from "@/lib/jsonWebtoken";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";

interface reqBodI {
    newUniqueUserName: string;
};

export async function POST(req: NextRequest) {
    try {
        const body: reqBodI = await req.json();

        const verifyToken = authorizeUserAuth(req);

        if (verifyToken.success === false || !verifyToken.data) {
            const res = NextResponse.json({ success: verifyToken.success, error: verifyToken.error }, { status: verifyToken.status });

            res.cookies.set("auth-token", "", {
                httpOnly: true,
                expires: new Date(0),
            });

            return res;
        };

        const userData: generateJWTDataType = verifyToken.data;

        const currentUserData = await UserAuthModel.findOne({ uniqueUserName: userData.uniqueUserName });

        if (!currentUserData) {
            return NextResponse.json({ success: false, error: "User not found." }, { status: 400 });
        };

        currentUserData.uniqueUserName = body.newUniqueUserName;
        await currentUserData.save();

        const tokenPayload: generateJWTDataType = {
            _id: currentUserData._id,
            fName: currentUserData.fName,
            lName: currentUserData.lName,
            userEmail: currentUserData.userEmail,
            uniqueUserName: currentUserData.uniqueUserName,
            isEmailVerified: currentUserData.isEmailVerified
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