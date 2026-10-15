import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { query } from "@/lib/db";

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const result = await query(
        "SELECT id, label, recipient_name, line_one, line_two, city, postal_code FROM addresses WHERE user_id = $1 ORDER BY created_at DESC",
        [user.userId]
    );
    return NextResponse.json({ addresses: result.rows });
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        const body = await request.json();
        const values = ["label", "recipientName", "lineOne", "lineTwo", "city", "postalCode"];
        const data = Object.fromEntries(values.map((key) => [key, typeof body[key] === "string" ? body[key].trim() : ""]));
        if (!data.label || !data.recipientName || !data.lineOne || !data.city || !data.postalCode) {
            return NextResponse.json({ error: "Label, recipient, address, city, and postal code are required" }, { status: 400 });
        }
        const result = await query(
            `INSERT INTO addresses (user_id, label, recipient_name, line_one, line_two, city, postal_code)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, label, recipient_name, line_one, line_two, city, postal_code`,
            [user.userId, data.label, data.recipientName, data.lineOne, data.lineTwo || null, data.city, data.postalCode]
        );
        return NextResponse.json({ address: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Address creation error:", error);
        return NextResponse.json({ error: "Unable to save address" }, { status: 500 });
    }
}
