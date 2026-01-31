import { connectMongoDB } from "@/mongodb/connectDB";
import FriendRequestModel from "@/mongodb/models/FriendRequest.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface reqBodyI {
    userId: string;
    pageSize: number;
}

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const body: reqBodyI = await req.json();

        if (!mongoose.Types.ObjectId.isValid(body.userId)) {
            return NextResponse.json({ success: false, error: "Invalid user" }, { status: 400 });
        };

        const currentUserId = new mongoose.Types.ObjectId(body.userId);

        const userActiveRequests = await FriendRequestModel.find({
            receivedBy: currentUserId,
            status: "pending",
            isActive: true,
            isDeleted: false,
        });

        return NextResponse.json({ success: true, requestList: userActiveRequests.slice(0, body.pageSize) }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong in /api/online/requests/ route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}