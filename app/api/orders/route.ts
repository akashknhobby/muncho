import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { query } from "@/lib/db";

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const result = await query(
        `SELECT o.id, o.status, o.total_amount, o.created_at, r.name AS restaurant_name,
                COALESCE(json_agg(json_build_object('name', d.name, 'quantity', oi.quantity))
                FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
         FROM orders o JOIN restaurants r ON r.id = o.restaurant_id
         LEFT JOIN order_items oi ON oi.order_id = o.id
         LEFT JOIN dishes d ON d.id = oi.dish_id
         WHERE o.customer_id = $1 GROUP BY o.id, r.name ORDER BY o.created_at DESC`,
        [user.userId]
    );
    return NextResponse.json({ orders: result.rows });
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        const body = await request.json();
        const restaurantId = Number(body.restaurantId);
        const addressId = Number(body.addressId);
        const paymentMethodId = Number(body.paymentMethodId);
        const items: Array<{ dishId: unknown; quantity: unknown }> = Array.isArray(body.items) ? body.items : [];
        if (!Number.isInteger(restaurantId) || !Number.isInteger(addressId) || !Number.isInteger(paymentMethodId) || items.length === 0) {
            return NextResponse.json({ error: "Restaurant, delivery address, payment method, and at least one dish are required" }, { status: 400 });
        }
        const ownedDetails = await query(
            `SELECT
                EXISTS (SELECT 1 FROM addresses WHERE id = $1 AND user_id = $3) AS address_valid,
                EXISTS (SELECT 1 FROM payment_methods WHERE id = $2 AND user_id = $3) AS payment_valid`,
            [addressId, paymentMethodId, user.userId]
        );
        if (!ownedDetails.rows[0].address_valid || !ownedDetails.rows[0].payment_valid) {
            return NextResponse.json({ error: "Selected address or payment method is invalid" }, { status: 400 });
        }
        const clientItems = items.map((item: { dishId: unknown; quantity: unknown }) => ({
            dish_id: Number(item.dishId), quantity: Number(item.quantity),
        }));
        if (clientItems.some((item) => !Number.isInteger(item.dish_id) || !Number.isInteger(item.quantity) || item.quantity < 1)) {
            return NextResponse.json({ error: "Invalid order items" }, { status: 400 });
        }
        const result = await query(
            `WITH selected AS (
                SELECT d.id, d.price, i.quantity
                FROM json_to_recordset($1::json) AS i(dish_id INTEGER, quantity INTEGER)
                JOIN dishes d ON d.id = i.dish_id AND d.restaurant_id = $2
            )
            SELECT id, price, quantity FROM selected`,
            [JSON.stringify(clientItems), restaurantId]
        );
        if (result.rows.length !== clientItems.length) {
            return NextResponse.json({ error: "One or more dishes are no longer available" }, { status: 400 });
        }
        const total = result.rows.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        const created = await query(
            `WITH created AS (
                INSERT INTO orders (customer_id, restaurant_id, total_amount, address_id, payment_method_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            )
            INSERT INTO order_items (order_id, dish_id, quantity, unit_price)
            SELECT created.id, item.id, item.quantity, item.price
            FROM created CROSS JOIN json_to_recordset($6::json) AS item(id INTEGER, quantity INTEGER, price NUMERIC)
            RETURNING order_id`,
            [user.userId, restaurantId, total.toFixed(2), addressId, paymentMethodId, JSON.stringify(result.rows)]
        );
        const orderId = created.rows[0].order_id;
        return NextResponse.json({ orderId, totalAmount: total }, { status: 201 });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: "Unable to place order" }, { status: 500 });
    }
}
