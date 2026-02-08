import { connectMongoDB } from "@/mongodb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import FriendRequestModel from "@/mongodb/models/FriendRequest.model";
import UserFriendModel from "@/mongodb/models/UserFriend.model";
import { authorizeUserAuth } from "@/functions/backend/authFunction";
import { generateJWTDataType } from "@/lib/jsonWebtoken";

interface reqBodyI {
    requestUserName: string
};

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

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

        const requestSendUser = await UserAuthModel.findOne({ uniqueUserName: body.requestUserName });

        if (!requestSendUser) {
            return NextResponse.json({ success: false, error: "Invalid user. Please enter a valid username to send a friend request." }, { status: 400 });
        };

        const currentUserFriends = await UserFriendModel.findOne({ userId: currentUserData._id });

        if (!currentUserFriends) {
            return NextResponse.json({ success: false, error: "Friend list model for the logged-in user was not found." }, { status: 400 });
        };

        if (currentUserFriends.friends.includes(requestSendUser._id)) {
            return NextResponse.json({ success: false, message: `You are already friends with ${body.requestUserName}. There is no need to send another friend request.` }, { status: 200 });
        };

        const isAlreadyExistRequest = await FriendRequestModel.findOne({
            sendBy: currentUserData._id,
            receivedBy: requestSendUser._id
        });

        if (isAlreadyExistRequest) {
            if (isAlreadyExistRequest.status === "pending") {
                return NextResponse.json({ success: false, error: `You have already sent a friend request to ${body.requestUserName}. Once the user rejects the request, you will be able to send a new request.` }, { status: 400 });
            }
            else if (isAlreadyExistRequest.isReported) {
                return NextResponse.json({ success: false, error: `You have been reported by ${body.requestUserName}. You can no longer send requests to this user.` }, { status: 400 });
            }
            else if (isAlreadyExistRequest.rejectionCount >= 3) {
                return NextResponse.json({ success: false, error: "Your friend request has been rejected three times. You can no longer send requests to this user." }, { status: 400 });
            } else if (isAlreadyExistRequest.isReported === true) {
                return NextResponse.json({ success: false, error: `You have been reported by user ${body.requestUserName}. You can no longer send requests to this user.` }, { status: 400 });
            } else {
                isAlreadyExistRequest.status = "pending";
                isAlreadyExistRequest.isActive = true;
                isAlreadyExistRequest.isDeleted = false;
                await isAlreadyExistRequest.save();

                return NextResponse.json({ success: true, message: `Your friend request has been successfully sent to ${body.requestUserName}.` }, { status: 200 });
            }
        };

        const newFriendRequest = await FriendRequestModel.create({
            sendBy: currentUserData._id,
            receivedBy: requestSendUser._id
        });

        return NextResponse.json({ success: true, message: `Your friend request has been successfully sent to ${body.requestUserName}.` }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong in /api/online/requests/create route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}