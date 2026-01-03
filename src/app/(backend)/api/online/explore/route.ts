import FriendRequestModel from "@/mongodb/models/FriendRequest.model";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import UserFriendModel from "@/mongodb/models/UserFriend.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface reqBodyI {
    userId: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: reqBodyI = await req.json();

        if (!mongoose.Types.ObjectId.isValid(body.userId)) {
            return NextResponse.json(
                { success: false, message: "Invalid user id" },
                { status: 400 }
            );
        };

        const currentUserId = new mongoose.Types.ObjectId(body.userId);

        let friendsIds: mongoose.Types.ObjectId[] = [];

        const userFriend = await UserFriendModel.findOne({
            userId: currentUserId,
            isActive: true,
            isDeleted: false,
        }).select("friends").lean<{ friends: mongoose.Types.ObjectId[] | null }>();

        if (!userFriend) {
            await UserFriendModel.create({ userId: currentUserId });
        } else {
            friendsIds = userFriend.friends || []
        };

        const blockedRequests = await FriendRequestModel.find({
            sendBy: currentUserId,
            isActive: true,
            isDeleted: false,
            $or: [
                { status: "pending" },
                { isReported: true }
            ]
        }).select("receivedBy").lean();

        const blockedUserIds = blockedRequests.map((req) => req.receivedBy);

        const excludedUserIds = [
            currentUserId,
            ...friendsIds,
            ...blockedUserIds
        ];

        const users = await UserAuthModel.find({
            _id: { $nin: excludedUserIds },
            isActive: true,
            isDeleted: false
        }).select("uniqueUserName fName lName").limit(30).lean();

        return NextResponse.json({ success: true, users }, { status: 200 });
        
    } catch (error) {
        console.log("Something went wrong in /api/online/explore/ route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}