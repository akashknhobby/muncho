import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { query } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const body = await request.json();
        const restaurantId = Number(body.restaurantId);
        const name = typeof body.name === "string" ? body.name.trim() : "";
        const price = Number(body.price);
        const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : null;

        if (!Number.isInteger(restaurantId) || !name || !Number.isFinite(price) || price < 0 || (imageUrl && imageUrl.length > 1000)) {
            return NextResponse.json({ error: "Restaurant, dish name, and a valid price are required" }, { status: 400 });
        }

        const result = await query(
            `INSERT INTO dishes (restaurant_id, name, price, image_url)
             SELECT $1, $2, $3, $5
             WHERE EXISTS (SELECT 1 FROM restaurants WHERE id = $1 AND owner_id = $4)
             RETURNING id, restaurant_id, name, price, image_url`,
            [restaurantId, name, price.toFixed(2), user.userId, imageUrl || null]
        );
        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Restaurant not found or not owned by you" }, { status: 404 });
        }
        return NextResponse.json({ dish: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Dish creation error:", error);
        return NextResponse.json({ error: "Unable to add dish" }, { status: 500 });
    }
}
