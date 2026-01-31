import { NextRequest, NextResponse } from "next/server";

export function GET() {
    try {
        const response = NextResponse.json({
            success: true,
            message: "You have successfully signed out of your multiplayer chess account."
        });

        response.cookies.set("auth-token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
        });

        return response;
    } catch (error) {
        console.log("Something went wrong in /api/auth/signout/ route", error);
        return Response.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
}