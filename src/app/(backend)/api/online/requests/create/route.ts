import { connectMongoDB } from "@/mongodb/connectDB";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import FriendRequestModel from "@/mongodb/models/FriendRequest.model";

interface reqBodyI {
    userId: string;
    requestUserName: string
};

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const body: reqBodyI = await req.json();

        if (!mongoose.Types.ObjectId.isValid(body.userId)) {
            return NextResponse.json({ success: false, error: "Invalid user" }, { status: 400 });
        };

        const currentUserId = new mongoose.Types.ObjectId(body.userId);

        const requestSendUser = await UserAuthModel.findOne({ uniqueUserName: body.requestUserName });

        if (!requestSendUser) {
            return NextResponse.json({ success: false, error: "Invalid user. Please enter a valid username to send a friend request." }, { status: 400 });
        }

        const isAlreadyExistRequest = await FriendRequestModel.findOne({
            sendBy: currentUserId,
            receivedBy: requestSendUser._id
        });

        if (isAlreadyExistRequest) {
            if (isAlreadyExistRequest.rejectionCount >= 3) {
                return NextResponse.json({ success: false, error: "Your friend request has been rejected three times. You can no longer send requests to this user." }, { status: 400 });
            } else if (isAlreadyExistRequest.isReported === true) {
                return NextResponse.json({ success: false, error: `You have been reported by user ${body.requestUserName}. You can no longer send requests to this user.` }, { status: 400 });
            } else {
                isAlreadyExistRequest.status = "pending";
                await isAlreadyExistRequest.save();

                return NextResponse.json({ success: true, message: `Your friend request has been successfully sent to ${body.requestUserName}.` }, { status: 200 });
            }
        };

        await FriendRequestModel.create({
            sendBy: currentUserId,
            receivedBy: requestSendUser._id
        });

        return NextResponse.json({ success: true, message: `Your friend request has been successfully sent to ${body.requestUserName}.` }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong in /api/online/requests/create route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}