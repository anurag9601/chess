import UserAuthModel from "@/mongodb/models/UserAuth.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface reqBodyI {
    userId: string;
    pageSize: number;
}

export async function POST(req: NextRequest) {
    try {
        const body: reqBodyI = await req.json();

        if (!mongoose.Types.ObjectId.isValid(body.userId)) {
            return NextResponse.json(
                { success: false, error: "Invalid user" },
                { status: 400 }
            );
        }

        const currentUserId = new mongoose.Types.ObjectId(body.userId);

        const users = await UserAuthModel.aggregate([
            {
                $match: {
                    _id: { $ne: currentUserId },
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
                                $expr: { $eq: ["$userId", currentUserId] },
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
                                                        { $eq: ["$sentBy", currentUserId] },
                                                        { $eq: ["$receivedBy", "$$targetUserId"] },
                                                    ],
                                                },
                                                {
                                                    $and: [
                                                        { $eq: ["$receivedBy", currentUserId] },
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
