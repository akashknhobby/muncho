import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { query } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const orderId = Number((await params).id);
    const { status } = await request.json();
    if (!Number.isInteger(orderId) || !["accepted", "preparing", "delivered", "cancelled"].includes(status)) {
        return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }
    const result = await query(
        `UPDATE orders o SET status = $1 FROM restaurants r
         WHERE o.id = $2 AND o.restaurant_id = r.id AND r.owner_id = $3
         RETURNING o.id, o.status`, [status, orderId, user.userId]
    );
    if (!result.rows.length) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order: result.rows[0] });
}
