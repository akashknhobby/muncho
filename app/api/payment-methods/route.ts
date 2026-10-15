import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { query } from "@/lib/db";

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const result = await query(
        "SELECT id, provider, brand, last_four, expiry_month, expiry_year FROM payment_methods WHERE user_id = $1 ORDER BY created_at DESC",
        [user.userId]
    );
    return NextResponse.json({ paymentMethods: result.rows });
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        const body = await request.json();
        const brand = typeof body.brand === "string" ? body.brand.trim().toLowerCase() : "";
        const lastFour = typeof body.lastFour === "string" ? body.lastFour.trim() : "";
        const expiryMonth = Number(body.expiryMonth);
        const expiryYear = Number(body.expiryYear);
        if (!brand || !/^\d{4}$/.test(lastFour) || !Number.isInteger(expiryMonth) || expiryMonth < 1 || expiryMonth > 12 || !Number.isInteger(expiryYear) || expiryYear < new Date().getFullYear()) {
            return NextResponse.json({ error: "Enter valid card details" }, { status: 400 });
        }
        const result = await query(
            `INSERT INTO payment_methods (user_id, brand, last_four, expiry_month, expiry_year)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, provider, brand, last_four, expiry_month, expiry_year`,
            [user.userId, brand, lastFour, expiryMonth, expiryYear]
        );
        return NextResponse.json({ paymentMethod: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Payment method creation error:", error);
        return NextResponse.json({ error: "Unable to save payment method" }, { status: 500 });
    }
}
