import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { query } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const restaurantId = Number((await params).id);
    const restaurant = await query("SELECT id, name FROM restaurants WHERE id = $1 AND owner_id = $2", [restaurantId, user.userId]);
    if (!restaurant.rows.length) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    const orders = await query(
        `SELECT o.id, o.status, o.total_amount, o.created_at, u.full_name AS customer_name,
                COALESCE(json_agg(json_build_object('name', d.name, 'quantity', oi.quantity))
                FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
         FROM orders o JOIN users u ON u.id = o.customer_id
         LEFT JOIN order_items oi ON oi.order_id = o.id LEFT JOIN dishes d ON d.id = oi.dish_id
         WHERE o.restaurant_id = $1 GROUP BY o.id, u.full_name ORDER BY o.created_at DESC`,
        [restaurantId]
    );
    return NextResponse.json({ restaurant: restaurant.rows[0], orders: orders.rows });
}
