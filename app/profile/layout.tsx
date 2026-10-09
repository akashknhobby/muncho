import React from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import "./profile.css";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="app">
            <Navbar />
            <main className="profile-main">
                <ul className="profile-sidebar">
                    <li><Link href="/profile/orders">Orders</Link></li>
                    <li><Link href="/profile/favourites">Favourites</Link></li>
                    <li><Link href="/profile/payments">Payments</Link></li>
                    <li><Link href="/profile/addresses">Addresses</Link></li>
                </ul>
                <div className="profile-content">{children}</div>
            </main>
        </div>
    );
}
