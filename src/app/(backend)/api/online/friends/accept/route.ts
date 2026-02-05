import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import FriendRequestModel from "@/mongodb/models/FriendRequest.model";
import UserAuthModel from "@/mongodb/models/UserAuth.model";

interface reqBodyI {
    userId: string;
    requestAcceptUserName: string;
};

export async function POST(req: NextRequest) {
    try {
        const body: reqBodyI = await req.json();

        if (!mongoose.Types.ObjectId.isValid(body.userId)) {
            return NextResponse.json({ success: false, error: "Invalid user" }, { status: 400 });
        };

        const currentUserId = new mongoose.Types.ObjectId(body.userId);

        const requestSendUser = await UserAuthModel.findOne({ uniqueUserName: body.requestAcceptUserName });

        if (!requestSendUser) {
            return NextResponse.json({ success: false, error: "Request acceptance failed because the user was not found." }, { status: 400 });
        }

        const friendRequest = await FriendRequestModel.findOne({
            sendBy: requestSendUser._id,
            receivedBy: currentUserId,
        });

        if (!friendRequest) {
            return NextResponse.json({ success: false, error: "Friend request not found." }, { status: 400 });
        };

        friendRequest.status = "accepted";
        friendRequest.isActive = false;
        friendRequest.isDeleted = true;
        await friendRequest.save();

        return NextResponse.json({ success: true, message: `🎉 Congratulations! You are now friends with ${body.requestAcceptUserName}.` }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong in /api/online/friends/accept route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}