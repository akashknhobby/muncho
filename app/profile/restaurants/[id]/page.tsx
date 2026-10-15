"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "../../../restaurants/restaurants.css";

type Order = { id: number; status: string; total_amount: string; customer_name: string; items: { name: string; quantity: number }[] };
type Dashboard = { restaurant: { name: string }; orders: Order[] };

export default function RestaurantDashboard() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<Dashboard | null>(null);
    const [error, setError] = useState("");
    useEffect(() => { fetch(`/api/owner/restaurants/${id}/dashboard`).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error); setData(body); }).catch((reason: Error) => setError(reason.message)); }, [id]);
    const updateStatus = async (orderId: number, status: string) => {
        const response = await fetch(`/api/orders/${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
        if (response.ok) setData((current) => current ? { ...current, orders: current.orders.map((order) => order.id === orderId ? { ...order, status } : order) } : current);
    };
    if (error) return <div><h1>Dashboard</h1><p className="form-error">{error}</p></div>;
    if (!data) return <p>Loading dashboard...</p>;
    return <div className="owner-dashboard"><div className="dashboard-heading"><div><p className="eyebrow">OWNER PORTAL</p><h1>{data.restaurant.name}</h1><p>Manage incoming orders and keep your kitchen moving.</p></div><span className="order-count">{data.orders.filter((order) => order.status === "pending").length} to review</span></div><h2 className="orders-heading">Orders</h2><div className="owner-orders">{data.orders.length === 0 ? <div className="empty-panel"><p>No orders yet.</p></div> : data.orders.map((order) => <article key={order.id}><div><strong>Order #{order.id} · {order.customer_name}</strong><p>{order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}</p><small>₹{Number(order.total_amount).toFixed(2)}</small></div><div className="order-controls"><b className={`status-${order.status}`}>{order.status}</b>{order.status === "pending" && <button onClick={() => updateStatus(order.id, "accepted")}>Accept</button>}{order.status === "accepted" && <button onClick={() => updateStatus(order.id, "preparing")}>Start preparing</button>}{order.status === "preparing" && <button onClick={() => updateStatus(order.id, "delivered")}>Mark ready</button>}</div></article>)}</div></div>;
}
