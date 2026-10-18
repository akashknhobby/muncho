"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import "./profile.css";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const links = [
        { href: "/profile/orders", label: "Orders" },
        { href: "/profile/favourites", label: "Favourites" },
        { href: "/profile/payments", label: "Payments" },
        { href: "/profile/addresses", label: "Addresses" },
        { href: "/profile/restaurants", label: "My Restaurants" },
    ];

    return (
        <div className="app">
            <Navbar />
            <main className="profile-main">
                <ul className="profile-sidebar">
                    {links.map(({ href, label }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                aria-current={
                                    pathname === href ||
                                    (href === "/profile/restaurants" && pathname.startsWith(`${href}/`))
                                        ? "page"
                                        : undefined
                                }
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="profile-content">{children}</div>
            </main>
        </div>
    );
}
