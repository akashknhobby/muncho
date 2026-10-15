"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if (data?.user) {
                    setUser(data.user);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/");
        router.refresh();
    };

    return (
        <nav className="site-nav">
            <h1 id="logo">
                <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Muncho</Link>
            </h1>
            <ul id="quicklinks">
                <li><Link href="/" style={{ color: "#1A1A1A", textDecoration: "none", fontWeight: "bold" }}>Home</Link></li>
                <li><Link href="/restaurants" style={{ color: "inherit", textDecoration: "none" }}>Restaurants</Link></li>
                <li><Link href="" style={{ color: "inherit", textDecoration: "none" }}>Offers</Link></li>
                <li><Link href="" style={{ color: "inherit", textDecoration: "none" }}>About</Link></li>
            </ul>
            <ul id="toolbar">
                <li className="search-nav-item">
                    <Link href="/search" aria-label="Search restaurants">
                        <img src="/search.svg" alt="Search" />
                    </Link>
                </li>
                <li className="cart-nav-item"><Link href="/cart">Cart</Link></li>
                {!loading && (
                    user ? (
                        <>
                            <li className="account-nav-item">
                                <Link
                                    href="/profile/orders"
                                >
                                    <span>👤</span>
                                    <span>{user.fullName}</span>
                                </Link>
                                <button className="logout-button"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="login-nav-item">
                            <Link href="/login">Login</Link>
                        </li>
                    )
                )}
                <li className="order-nav-item">
                    <Link href="/restaurants">Order Now</Link>
                </li>
            </ul>
        </nav>
    );
}