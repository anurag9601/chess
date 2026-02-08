import { authorizeUserAuth } from "@/functions/backend/authFunction";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
    try {
        const verifyToken = authorizeUserAuth(req);

        if (verifyToken.success === false) {
            const res = NextResponse.json({ success: verifyToken.success, error: verifyToken.error }, { status: verifyToken.status });

            res.cookies.set("auth-token", "", {
                httpOnly: true,
                expires: new Date(0),
            });

            return res;
        } else if (verifyToken.success === true) {
            return NextResponse.json({ success: verifyToken.success, data: verifyToken.data }, { status: verifyToken.status });
        }
    } catch (error) {
        console.log("Something went wrong in /api/authorization/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}