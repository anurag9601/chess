import { verifyJWT } from "@/lib/jsonWebtoken";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";

export function authorizeUserAuth(req: NextRequest) {
    const token: RequestCookie | undefined = req.cookies.get("auth-token");

    if (!token) {
        return { success: false, token: false, verified: false, error: "No token found", status: 401 };
    };

    try {
        const isVerify = verifyJWT(token.value);

        if (isVerify) {
            return { success: true, token: true, verified: true, data: isVerify, status: 200 }
        } else {
            return { success: false, token: true, verified: false, error: "Invalid token", status: 401 }
        }
    } catch (error) {
        return { success: false, token: true, verified: false, error: "Invalid token", status: 401 }
    }
}