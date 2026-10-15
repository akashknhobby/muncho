import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { query } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const mine = searchParams.get("mine") === "true";

    if (mine) {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }
        const ownedRestaurants = await query(
            `SELECT id, name, location, latitude, longitude, image_url AS "imageUrl"
             FROM restaurants WHERE owner_id = $1 ORDER BY name ASC`,
            [user.userId]
        );
        return NextResponse.json({ restaurants: ownedRestaurants.rows });
    }

    const result = await query(
        `SELECT id, name, location, latitude, longitude, image_url AS "imageUrl"
         FROM restaurants
         WHERE ($1 = '' OR name ILIKE $2 OR location ILIKE $2)
         ORDER BY name ASC`,
        [search, `%${search}%`]
    );
    return NextResponse.json({ restaurants: result.rows });
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const body = await request.json();
        const name = typeof body.name === "string" ? body.name.trim() : "";
        const location = typeof body.location === "string" ? body.location.trim() : "";
            const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : null;
        const latitude = body.latitude === "" || body.latitude == null ? null : Number(body.latitude);
        const longitude = body.longitude === "" || body.longitude == null ? null : Number(body.longitude);

        if (!name || !location) {
            return NextResponse.json({ error: "Restaurant name and location are required" }, { status: 400 });
        }
        if (name.length > 150 || location.length > 500 || (imageUrl && imageUrl.length > 1000)) {
            return NextResponse.json({ error: "Restaurant name or location is too long" }, { status: 400 });
        }
        if ((latitude !== null && !Number.isFinite(latitude)) || (longitude !== null && !Number.isFinite(longitude))) {
            return NextResponse.json({ error: "Location coordinates must be valid numbers" }, { status: 400 });
        }

        const result = await query(
            `INSERT INTO restaurants (name, location, latitude, longitude, image_url, owner_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, name, location, latitude, longitude, image_url, owner_id, created_at`,
            [name, location, latitude, longitude, imageUrl || null, user.userId]
        );
        return NextResponse.json({ restaurant: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Restaurant creation error:", error);
        return NextResponse.json({ error: "Unable to create restaurant" }, { status: 500 });
    }
}
