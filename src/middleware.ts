import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname === '/auth') {
        const url = req.nextUrl.clone();

        url.pathname = '/auth/signin';

        return NextResponse.redirect(url);
    };

    return NextResponse.next();
};

export const config = {
    matcher: ["/auth"],
}