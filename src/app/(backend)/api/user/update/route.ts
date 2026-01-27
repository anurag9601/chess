import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest } from "next/server";

interface reqBodI {
    userId: string;
    newUniqueUserName: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: reqBodI = await req.json();

        const user = await UserAuthModel.findOne({ _id: body.userId });

        if (!user) {
            return Response.json(
                { success: false, error: "User not found." },
                { status: 404 }
            );
        }


        user.uniqueUserName = body.newUniqueUserName;
        await user.save();

        return Response.json({ success: true, message: "Congratulations!🎉 Your username has been updated successfully." }, { status: 200 });
    } catch (error) {
        console.log("Something went wrong in /api/user/update/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}