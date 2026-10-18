"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearLegacyCart } from "../cart/cart-storage";
import { isAuthChangeEvent, notifyAuthChanged } from "../../lib/auth-events";

export default function Navbar() {
    const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const reloadAfterAccountChange = (event: StorageEvent) => {
            if (isAuthChangeEvent(event)) window.location.reload();
        };
        window.addEventListener("storage", reloadAfterAccountChange);
        fetch("/api/auth/me")
            .then((res) => {
                if (!res.ok) throw new Error("Unable to check your login status.");
                return res.json();
            })
            .then((data) => {
                if (data?.user) {
                    setUser(data.user);
                }
            })
            .catch((reason: unknown) => {
                console.error("Unable to load the current user:", reason);
                setAuthError("Your login status could not be checked.");
            })
            .finally(() => setLoading(false));
        return () => window.removeEventListener("storage", reloadAfterAccountChange);
    }, []);

    const handleLogout = async () => {
        setAuthError("");
        try {
            const response = await fetch("/api/auth/logout", { method: "POST" });
            if (!response.ok) throw new Error("Unable to log out.");
            setUser(null);
            clearLegacyCart();
            notifyAuthChanged();
            router.replace("/login");
            router.refresh();
        } catch (reason) {
            console.error("Logout failed:", reason);
            setAuthError("Logout failed. Please try again.");
        }
    };

    return (
        <nav className="site-nav">
            <div id="logo">
                <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Muncho</Link>
            </div>
            <ul id="quicklinks">
                <li><Link href="/" style={{ color: "#1A1A1A", textDecoration: "none", fontWeight: "bold" }}>Home</Link></li>
                <li><Link href="/restaurants" style={{ color: "inherit", textDecoration: "none" }}>Restaurants</Link></li>
            </ul>
            <ul id="toolbar">
                <li className="search-nav-item">
                    <Link href="/search" aria-label="Search restaurants">
                        <Image src="/search.svg" alt="" width={17} height={17} />
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
                {authError && <li className="nav-auth-error" role="status">{authError}</li>}
                <li className="order-nav-item">
                    <Link href="/restaurants">Order Now</Link>
                </li>
            </ul>
        </nav>
    );
}