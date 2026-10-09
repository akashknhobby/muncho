import { NextResponse } from "next/server";
import { TOKEN_NAME } from "@/lib/auth";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.delete(TOKEN_NAME);
    return response;
}
