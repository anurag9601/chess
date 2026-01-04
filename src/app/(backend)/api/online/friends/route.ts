import { connectMongoDB } from "@/mongodb/connectDB";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import UserFriendModel from "@/mongodb/models/UserFriend.model";
import { NextRequest, NextResponse } from "next/server";

interface reqBodyI {
    userName: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: reqBodyI = await req.json();

        const userInfo = await UserAuthModel.findOne({ uniqueUserName: body.userName, isActive: true, isDeleted: false });

        if (!userInfo) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 400 });
        };

        const userFriendData = await UserFriendModel.findOne({
            userId: userInfo._id,
            isActive: true,
            isDeleted: false,
        });

        return NextResponse.json({ success: true, users: userFriendData.friends });

    } catch (error) {
        console.log("Something went wrong in /api/online/friends/ route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}