import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const restaurantId = Number(id);
    if (!Number.isInteger(restaurantId)) {
        return NextResponse.json({ error: "Invalid restaurant ID" }, { status: 400 });
    }

    const result = await query(
        `SELECT
            r.id, r.name, r.location, r.latitude, r.longitude, r.image_url AS "imageUrl",
            COALESCE(
                json_agg(
                    json_build_object('id', d.id, 'name', d.name, 'price', d.price, 'imageUrl', d.image_url)
                    ORDER BY d.name
                ) FILTER (WHERE d.id IS NOT NULL),
                '[]'
            ) AS dishes
         FROM restaurants r
         LEFT JOIN dishes d ON d.restaurant_id = r.id
         WHERE r.id = $1
         GROUP BY r.id`,
        [restaurantId]
    );

    if (result.rows.length === 0) {
        return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    return NextResponse.json({ restaurant: result.rows[0] });
}
