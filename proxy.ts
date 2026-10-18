import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_NAME, verifyToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
    const token = request.cookies.get(TOKEN_NAME)?.value;
    if (token && verifyToken(token)) return NextResponse.next();

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
        "next",
        `${request.nextUrl.pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ["/cart", "/checkout", "/profile", "/profile/:path*", "/order-complete"],
};
