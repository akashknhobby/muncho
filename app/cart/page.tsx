"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { CartItem, readCart, writeCart } from "./cart-storage";
import "../restaurants/restaurants.css";

export default function CartPage() {
    const [cart, setCart] = useState<{ restaurantId: number; restaurantName: string; items: CartItem[] } | null | undefined>(undefined);
    const [userId, setUserId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        const loadCart = async () => {
            try {
                const response = await fetch("/api/auth/me", { signal: controller.signal });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Unable to check your login status.");
                if (!active) return;
                if (typeof data.user?.id !== "number") {
                    const returnTo = `${window.location.pathname}${window.location.search}`;
                    router.replace(`/login?next=${encodeURIComponent(returnTo)}`);
                    return;
                }
                setUserId(data.user.id);
                setCart(readCart(data.user.id));
            } catch (reason) {
                if (!active || (reason instanceof Error && reason.name === "AbortError")) return;
                setError(reason instanceof Error ? reason.message : "Unable to load your cart.");
                setCart(null);
            }
        };
        void loadCart();
        return () => {
            active = false;
            controller.abort();
        };
    }, [router]);

    const update = (dishId: number, delta: number) => {
        if (!cart || userId === null) return;
        const items = cart.items.map((item) => item.dishId === dishId ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0);
        const next = items.length ? { ...cart, items } : null;
        setCart(next);
        writeCart(userId, next);
    };
    const total = cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
    return <div className="app"><Navbar /><main className="browse-main"><section className="checkout-shell">
        <Link className="back-link" href="/restaurants">← Continue browsing</Link>
        <p className="eyebrow">YOUR CART</p><h1>Review your order</h1>
        {error && <p className="form-error" role="alert">{error}</p>}
        {cart === undefined ? <p aria-live="polite">Loading your cart...</p> : !cart?.items.length ? <div className="empty-panel"><h2>Your cart is empty</h2><p>Add something delicious from a restaurant to get started.</p><Link className="primary-link" href="/restaurants">Browse restaurants</Link></div> : <div className="checkout-grid"><div className="cart-page-card"><h2>{cart.restaurantName}</h2>{cart.items.map((item) => <div className="cart-page-row" key={item.dishId}>{item.imageUrl ? <Image src={item.imageUrl} alt="" width={64} height={64} unoptimized /> : <div className="dish-image-fallback">🥘</div>}<div className="cart-page-item"><strong>{item.name}</strong><span>₹{item.price.toFixed(2)}</span></div><div className="quantity-stepper"><button type="button" aria-label={`Remove one ${item.name}`} onClick={() => update(item.dishId, -1)}>−</button><span>{item.quantity}</span><button type="button" aria-label={`Add one ${item.name}`} onClick={() => update(item.dishId, 1)}>+</button></div></div>)}</div><aside className="cart-total-card"><span>Subtotal</span><strong>₹{total.toFixed(2)}</strong><small>Delivery charges are calculated at checkout.</small><Link className="place-order-button checkout-link" href="/checkout">Continue to checkout</Link></aside></div>}
    </section></main></div>;
}
