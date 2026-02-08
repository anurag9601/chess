import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";
import { authorizeUserAuth } from "@/functions/backend/authFunction";
import { generateJWTDataType } from "@/lib/jsonWebtoken";

interface reqBodyI {
    pageSize: number;
    searchQuery: string;
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

        const users = await UserAuthModel.aggregate([
            {
                $match: {
                    _id: { $ne: currentUserData._id },
                    isActive: true,
                    isDeleted: false,
                },
            },

            {
                $lookup: {
                    from: "userfriends",
                    let: { targetUserId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$userId", currentUserData._id] },
                            },
                        },
                        {
                            $project: {
                                friends: 1,
                                _id: 0,
                            },
                        },
                    ],
                    as: "friendData",
                },
            },

            {
                $lookup: {
                    from: "friendrequests",
                    let: { targetUserId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$status", "pending"] },
                                        {
                                            $or: [
                                                {
                                                    $and: [
                                                        { $eq: ["$sentBy", currentUserData._id] },
                                                        { $eq: ["$receivedBy", "$$targetUserId"] },
                                                    ],
                                                },
                                                {
                                                    $and: [
                                                        { $eq: ["$receivedBy", currentUserData._id] },
                                                        { $eq: ["$sentBy", "$$targetUserId"] },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "requestData",
                },
            },

            {
                $addFields: {
                    isFriend: {
                        $in: [
                            "$_id",
                            {
                                $ifNull: [
                                    { $arrayElemAt: ["$friendData.friends", 0] },
                                    [],
                                ],
                            },
                        ],
                    },
                    isAlreadyRequestSend: {
                        $gt: [{ $size: "$requestData" }, 0],
                    },
                },
            },

            {
                $project: {
                    userName: "$uniqueUserName",
                    isFriend: 1,
                    isAlreadyRequestSend: 1,
                    _id: 0,
                },
            },

            {
                $limit: body.pageSize || 10,
            },
        ]);

        return NextResponse.json(
            { success: true, users: users },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in /api/online/explore", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong" },
            { status: 500 }
        );
    }
}
