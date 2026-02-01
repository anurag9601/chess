import FriendRequestModel from "@/mongodb/models/FriendRequest.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import UserFriendModel from "@/mongodb/models/UserFriend.model";

interface reqBodyI {
    userId: string;
    pageSize: number;
}

export async function POST(req: NextRequest) {
    try {
        const body: reqBodyI = await req.json();

        if (!mongoose.Types.ObjectId.isValid(body.userId)) {
            return NextResponse.json({ success: false, error: "Invalid user" }, { status: 400 });
        };

        const currentUserId = new mongoose.Types.ObjectId(body.userId);

        const activeRequests = await FriendRequestModel.find({
            receivedBy: currentUserId,
            status: "pending"
        });

        const currentUserFriends = await UserFriendModel.findOne({
            userId: currentUserId,
        });

        const alreadyFriends = currentUserFriends.friends ?? [];

        console.log("activeRequests", activeRequests);
        console.log("alreadyFriends", alreadyFriends);

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong in /api/online/explore/ route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}