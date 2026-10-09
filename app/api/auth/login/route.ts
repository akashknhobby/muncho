import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { signToken, TOKEN_NAME } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, rememberMe } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user exists
        const existing = await query(
            "SELECT id, email, full_name, password_hash FROM users WHERE email = $1",
            [normalizedEmail]
        );

        const user = existing.rows[0];

        if (!user) {
            return NextResponse.json(
                { error: "User not found. Please sign up first." },
                { status: 404 }
            );
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = signToken(
            {
                userId: user.id,
                email: user.email,
                fullName: user.full_name,
            },
            Boolean(rememberMe)
        );

        const response = NextResponse.json({
            message: "Logged in successfully",
            user: { id: user.id, email: user.email, fullName: user.full_name },
        });

        // Cookie maxAge: 30 days if rememberMe, else 1 day
        const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;

        response.cookies.set({
            name: TOKEN_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge,
        });

        return response;
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
