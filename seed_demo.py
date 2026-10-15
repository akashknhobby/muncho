#!/usr/bin/env python3
"""Reset the local Muncho database and load coherent demo data."""

import os
from pathlib import Path

import psycopg2


def load_env() -> None:
    env_path = Path(__file__).resolve().parent / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip("'\""))


def main() -> None:
    load_env()
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise SystemExit("DATABASE_URL is required")

    with psycopg2.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                TRUNCATE TABLE order_items, orders, dishes, restaurants, users
                RESTART IDENTITY CASCADE;

                INSERT INTO users (email, full_name, password_hash) VALUES
                    ('owner@muncho.test', 'Maya Owner', %s),
                    ('customer@muncho.test', 'Aarav Customer', %s);

                INSERT INTO restaurants
                    (name, location, latitude, longitude, image_url, owner_id)
                VALUES
                    ('Green Bowl Kitchen', '12 Market Street, Bengaluru',
                     12.971600, 77.594600,
                     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
                     1),
                    ('Saffron Table', '8 Lake Road, Hyderabad',
                     17.385000, 78.486700,
                     'https://images.unsplash.com/photo-1552566626-52f8b3b5f9d8?auto=format&fit=crop&w=1400&q=85',
                     1);

                INSERT INTO dishes (restaurant_id, name, price, image_url) VALUES
                    (1, 'Avocado Grain Bowl', 249.00,
                     'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=85'),
                    (1, 'Paneer Tikka Wrap', 189.00,
                     'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=85'),
                    (1, 'Mango Matcha Cooler', 129.00,
                     'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=700&q=85'),
                    (2, 'Butter Chicken Bowl', 299.00,
                     'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=85'),
                    (2, 'Garlic Naan', 79.00,
                     'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85'),
                    (2, 'Rose Lassi', 119.00,
                     'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=700&q=85');

                INSERT INTO orders (customer_id, restaurant_id, status, total_amount) VALUES
                    (2, 1, 'pending', 438.00),
                    (2, 2, 'delivered', 378.00);

                INSERT INTO order_items (order_id, dish_id, quantity, unit_price) VALUES
                    (1, 1, 1, 249.00),
                    (1, 2, 1, 189.00),
                    (2, 4, 1, 299.00),
                    (2, 5, 1, 79.00);
                """,
                (
                    "$2b$10$muSn56NurGLnNFv52Xmp5eid2bBuXk2VJZXvnT2D0wcCKsJsHseK.",
                    "$2b$10$muSn56NurGLnNFv52Xmp5eid2bBuXk2VJZXvnT2D0wcCKsJsHseK.",
                ),
            )
    print("Demo database reset and seeded.")
    print("Demo login: owner@muncho.test / demo1234")
    print("Demo login: customer@muncho.test / demo1234")


if __name__ == "__main__":
    main()
