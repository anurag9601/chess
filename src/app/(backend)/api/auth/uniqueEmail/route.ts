import { connectMongoDB } from "@/mongodb/connectDB";
import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";

interface reqBodyI {
    enteredEmail: string;
}

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        
        const body: reqBodyI = await req.json();

        const isEmailAlreadyExist = await UserAuthModel.findOne({ userEmail: body.enteredEmail });

        if (isEmailAlreadyExist) {
            return NextResponse.json(
                {
                    success: false,
                    error: "This email address is already associated with an existing account.",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Great! This email address is available for registration.",
            },
            { status: 200 }
        );

    } catch (error) {
        console.log("Something went wrong in /api/auth/uniqueEmail/ route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}