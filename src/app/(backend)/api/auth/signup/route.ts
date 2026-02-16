import { connectMongoDB } from "@/mongodb/connectDB";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import UserFriendModel from "@/mongodb/models/UserFriend.model";
import { NextRequest, NextResponse } from "next/server";

interface reqBodyI {
    fName: string;
    lName: string;
    userEmail: string;
    uniqueUserName: string;
}

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const body: reqBodyI = await req.json();

        const isUserAlreadyExist = await UserAuthModel.findOne({
            $or: [
                { userEmail: body.userEmail },
                { uniqueUserName: body.uniqueUserName }
            ]
        });

        if (isUserAlreadyExist) {
            return NextResponse.json({ success: false, error: "User name or Email is already registered." }, { status: 400 });
        };

        const currentUser = await UserAuthModel.create({
            fName: body.fName,
            lName: body.lName,
            userEmail: body.userEmail.replace(/\s+/g, ""),
            uniqueUserName: body.uniqueUserName.replace(/\s+/g, ""),
        });

        await UserFriendModel.create({
            userId: currentUser._id
        });

        return NextResponse.json({ success: true, message: "🎉 Congratulations! Your registration has been successfully completed." }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong in /api/auth/signup/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}