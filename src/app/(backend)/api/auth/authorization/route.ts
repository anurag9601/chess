import { verifyJWT } from "@/lib/jsonWebtoken";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: "No token found" }, { status: 401 });
        }

        try {
            const isVerify = verifyJWT(token);

            if (isVerify) {
                return NextResponse.json({ success: true, data: isVerify }, { status: 200 });
            } else {
                const res = NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

                res.cookies.set("auth-token", "", {
                    httpOnly: true,
                    expires: new Date(0),
                });

                return res;
            }
        } catch (error) {
            const res = NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

            res.cookies.set("auth-token", "", {
                httpOnly: true,
                expires: new Date(0),
                path: "/"
            });

            return res;
        }
    } catch (error) {
        console.log("Something went wrong in /api/authorization/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}