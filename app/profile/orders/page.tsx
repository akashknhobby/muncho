"use client";

import { useEffect, useState } from "react";

type Order = {
    id: number;
    status: string;
    total_amount: string;
    restaurant_name: string;
    items: { name: string; quantity: number }[];
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [message, setMessage] = useState("Loading your orders...");

    useEffect(() => {
        fetch("/api/orders")
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Please log in to see your orders.");
                setOrders(data.orders);
                setMessage(data.orders.length ? "" : "Your orders will appear here.");
            })
            .catch((error: Error) => setMessage(error.message));
    }, []);

    return (
        <div>
            <h1>Orders</h1>
            {message && <p>{message}</p>}
            <div className="owner-orders">
                {orders.map((order) => (
                    <article key={order.id}>
                        <div>
                            <strong>{order.restaurant_name} · Order #{order.id}</strong>
                            <p>{order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}</p>
                        </div>
                        <div>
                            <b className={`status-${order.status}`}>{order.status}</b>
                            <p>₹{Number(order.total_amount).toFixed(2)}</p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
