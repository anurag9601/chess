import { authorizeUserAuth } from "@/functions/backend/authFunction";
import { generateJWTDataType } from "@/lib/jsonWebtoken";
import { connectMongoDB } from "@/mongodb/connectDB";
import FriendRequestModel from "@/mongodb/models/FriendRequest.model";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";

interface reqBodyI {
    pageSize: number;
    searchQuery: string;
}

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

        const userActiveRequests = await FriendRequestModel.find({
            receivedBy: currentUserData._id,
            status: "pending",
            isActive: true,
            isDeleted: false,
        }).populate({
            path: "sendBy",
            select: "uniqueUserName -_id"
        }).select("sendBy -_id").limit(body.pageSize);

        const requestList = userActiveRequests.map((req) => req.sendBy.uniqueUserName);

        return NextResponse.json({ success: true, requestList: requestList }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong in /api/online/requests/ route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}