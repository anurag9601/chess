import { NextRequest, NextResponse } from "next/server";
import FriendRequestModel from "@/mongodb/models/FriendRequest.model";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { authorizeUserAuth } from "@/functions/backend/authFunction";
import { generateJWTDataType } from "@/lib/jsonWebtoken";
import UserFriendModel from "@/mongodb/models/UserFriend.model";

interface reqBodyI {
    requestAcceptUserName: string;
};

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

        const requestSendUser = await UserAuthModel.findOne({ uniqueUserName: body.requestAcceptUserName });

        if (!requestSendUser) {
            return NextResponse.json({ success: false, error: "Request acceptance failed because the user was not found." }, { status: 400 });
        }

        const friendRequest = await FriendRequestModel.findOne({
            sendBy: requestSendUser._id,
            receivedBy: currentUserData._id,
            status: "pending",
            isActive: true,
            isDeleted: false,
        });

        if (!friendRequest) {
            return NextResponse.json({ success: false, error: "Friend request not found." }, { status: 400 });
        };

        friendRequest.status = "accepted";
        friendRequest.isActive = false;
        friendRequest.isDeleted = true;
        await friendRequest.save();

        const currentUserActiveFriendRequestForRequestSendUser = await FriendRequestModel.findOne({ sendBy: currentUserData._id, receivedBy: requestSendUser._id, status: "pending", isActive: true, isDeleted: false });

        if (currentUserActiveFriendRequestForRequestSendUser) {
            currentUserActiveFriendRequestForRequestSendUser.status = "accepted";
            currentUserActiveFriendRequestForRequestSendUser.isActive = false;
            currentUserActiveFriendRequestForRequestSendUser.isDeleted = true;
            await currentUserActiveFriendRequestForRequestSendUser.save();
        }

        const userFriendList = await UserFriendModel.findOne({ userId : currentUserData._id });

        userFriendList.friends.push(requestSendUser._id);
        await userFriendList.save();

        const requestsendUserFriendList = await UserFriendModel.findOne({ userId : requestSendUser._id });

        requestsendUserFriendList.friends.push(currentUserData._id);
        await requestsendUserFriendList.save();

        return NextResponse.json({ success: true, message: `🎉 Congratulations! You are now friends with ${body.requestAcceptUserName}.` }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong in /api/online/friends/accept route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}