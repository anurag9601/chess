import { connectMongoDB } from "@/mongodb/connectDB";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";

interface reqBodI {
    uniqueUserName: string;
}

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const body: reqBodI = await req.json();

        const isUserNameAlreadyExist = await UserAuthModel.findOne({ uniqueUserName: body.uniqueUserName });

        if (isUserNameAlreadyExist) {
            return NextResponse.json(
                {
                    success: false,
                    error: "This username is already taken. Please choose a different one.",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Great! This username is available. You can proceed with registration.",
            },
            { status: 200 }
        );
        
    } catch (error) {
        console.log("Something went wrong in /api/auth/uniqueUserName/ route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}