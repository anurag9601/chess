import { connectMongoDB } from "@/mongodb/connectDB";
import UserFriendModel from "@/mongodb/models/UserFriend.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface reqBodyI {
    userId: string;
    pageSize: number;
    searchQuery: string;
}

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const body: reqBodyI = await req.json();

        if (!mongoose.Types.ObjectId.isValid(body.userId)) {
            return NextResponse.json({ success: false, error: "Invalid user" }, { status: 400 });
        };

        const currentUserId = new mongoose.Types.ObjectId(body.userId);

        const userFriendData = await UserFriendModel.findOne({
            userId: currentUserId,
            isActive: true,
            isDeleted: false,
        });

        if (!userFriendData) {
            return NextResponse.json({ success: false, error: "User not found " }, { status: 400 });
        };

        return NextResponse.json({ success: true, users: userFriendData.friends.slice(0, body.pageSize) });

    } catch (error) {
        console.log("Something went wrong in /api/online/friends/ route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}