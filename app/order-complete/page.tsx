"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import "../restaurants/restaurants.css";

export default function OrderCompletePage() {
    return <div className="app"><Navbar /><main className="browse-main"><section className="success-card">
        <div className="success-orb">✓</div><h1>Order complete!</h1>
        <p>Your order has been sent to the restaurant. You can track its status from your orders page.</p>
        <Link href="/profile/orders">View my orders</Link>
    </section></main></div>;
}
