import { NextRequest, NextResponse } from "next/server";

export function POST(req: NextRequest) {
    try {

    } catch (error) {
        console.log("Something went wrong in /api/online/friends/ route", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}