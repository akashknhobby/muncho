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
        <nav>
            <h1 id="logo" style={{ fontSize: "22px" }}>
                <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Muncho</Link>
            </h1>
            <ul id="quicklinks" style={{ listStyleType: "none", margin: 0, padding: 0 }}>
                <li><Link href="/" style={{ color: "#1A1A1A", textDecoration: "none", fontWeight: "bold" }}>Home</Link></li>
                <li><Link href="" style={{ color: "inherit", textDecoration: "none" }}>Restaurants</Link></li>
                <li><Link href="" style={{ color: "inherit", textDecoration: "none" }}>Offers</Link></li>
                <li><Link href="" style={{ color: "inherit", textDecoration: "none" }}>About</Link></li>
            </ul>
            <ul id="toolbar" style={{ listStyleType: "none", margin: 0, padding: 0, display: "flex", alignItems: "center", gap: "12px" }}>
                <li style={{ padding: "11px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Link href="" style={{ textDecoration: "none", color: "#555555" }}>
                        <img src="/search.svg" alt="Search" />
                    </Link>
                </li>
                {!loading && (
                    user ? (
                        <>
                            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Link
                                    href="/profile/orders"
                                    style={{
                                        fontWeight: 600,
                                        color: "#1A1A1A",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px"
                                    }}
                                >
                                    <span>👤</span>
                                    <span>{user.fullName}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#888",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                        padding: 0
                                    }}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link href="/login" style={{ color: "inherit", textDecoration: "none" }}>Login</Link>
                        </li>
                    )
                )}
                <li style={{ backgroundColor: "#FF9E4F" }}>
                    <Link href="" style={{ color: "white", textDecoration: "none" }}>Order Now</Link>
                </li>
            </ul>
        </nav>
    );
}