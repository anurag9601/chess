import FriendRequestModel from "@/mongodb/models/FriendRequest.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { authorizeUserAuth } from "@/functions/backend/authFunction";
import { generateJWTDataType } from "@/lib/jsonWebtoken";

interface reqBodyI {
    requestRejectUserName: string;
}

export async function POST(req: NextRequest) {
    try {

        const body: reqBodyI = await req.json();

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

        const requestSendUser = await UserAuthModel.findOne({ uniqueUserName: body.requestRejectUserName });

        if (!requestSendUser) {
            return NextResponse.json({ success: false, error: "Request acceptance failed because the user was not found." }, { status: 400 });
        }

        const friendRequest = await FriendRequestModel.findOne({
            sendBy: requestSendUser._id,
            receivedBy: currentUserData._id,
        });

        if (!friendRequest) {
            return NextResponse.json({ success: false, error: "Friend request not found." }, { status: 400 });
        };

        friendRequest.status = "rejected";
        friendRequest.rejectionCount = friendRequest.rejectionCount + 1;
        friendRequest.isActive = false;
        friendRequest.isDeleted = true;
        await friendRequest.save();

        return NextResponse.json({
            success: true, message: `The request from ${body.requestRejectUserName} has been successfully rejected.
            After three rejections or reports, this user will no longer be able to send you requests.` }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong in /api/online/friends/reject route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}