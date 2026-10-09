import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { signToken, TOKEN_NAME } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, fullName, password } = body;

        if (!email || !fullName || !password) {
            return NextResponse.json(
                { error: "Email, full name, and password are required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();
        const trimmedFullName = fullName.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        if (trimmedFullName.length < 2) {
            return NextResponse.json(
                { error: "Full name must be at least 2 characters long" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await query("SELECT id FROM users WHERE email = $1", [
            normalizedEmail,
        ]);

        if (existing.rows.length > 0) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new user
        const result = await query(
            "INSERT INTO users (email, full_name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, full_name, created_at",
            [normalizedEmail, trimmedFullName, password_hash]
        );

        const newUser = result.rows[0];

        // Sign token for direct login after signup
        const token = signToken({
            userId: newUser.id,
            email: newUser.email,
            fullName: newUser.full_name,
        });

        const response = NextResponse.json(
            {
                message: "User registered successfully",
                user: { id: newUser.id, email: newUser.email, fullName: newUser.full_name },
            },
            { status: 201 }
        );

        // Set auth cookie (default 7 days after signup)
        response.cookies.set({
            name: TOKEN_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
