import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("auth-token")?.value;

    const publicPaths = ["/auth/signin", "/auth/signup", "/api/auth"];
    const privatePaths = ["/", "/play"];

    if (pathname === "/auth") {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/signin";
        return NextResponse.redirect(url);
    };

    if (!token && privatePaths.includes(pathname)) {
        const signinUrl = req.nextUrl.clone();
        signinUrl.pathname = '/auth/signin';
        return NextResponse.redirect(signinUrl);
    };

    if (token && publicPaths.includes(pathname)) {
        return NextResponse.redirect(req.nextUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
