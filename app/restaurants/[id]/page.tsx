"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../restaurants.css";
import dynamic from "next/dynamic";
import { clearLegacyCart, readCart, writeCart, CartItem } from "../../cart/cart-storage";

const LocationPicker = dynamic(() => import("../../profile/restaurants/LocationPicker"), { ssr: false });
type Dish = { id: number; name: string; price: string; imageUrl?: string };
type Restaurant = { id: number; name: string; location: string; latitude: number | null; longitude: number | null; imageUrl?: string; dishes: Dish[] };

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [error, setError] = useState("");
    const [cart, setCart] = useState<Record<number, number>>({});
    const [search, setSearch] = useState("");
    const [cartOpen, setCartOpen] = useState(false);
    const [cartReady, setCartReady] = useState(false);
    const [bannerFailed, setBannerFailed] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        let active = true;
        const controller = new AbortController();
        const loadRestaurant = async () => {
            try {
                const { id } = await params;
                if (!active) return;
                setRestaurant(null);
                setCart({});
                setCartReady(false);
                setUserId(null);
                const [response, sessionResponse] = await Promise.all([
                    fetch(`/api/restaurants/${id}`, { signal: controller.signal }),
                    fetch("/api/auth/me", { signal: controller.signal }),
                ]);
                const [data, session] = await Promise.all([
                    response.json(),
                    sessionResponse.json(),
                ]);
                if (!response.ok) throw new Error(data.error || "Unable to load restaurant.");
                if (!sessionResponse.ok) throw new Error(session.error || "Unable to check your login status.");
                if (!active) return;
                const loadedRestaurant: Restaurant = data.restaurant;
                const currentUserId = typeof session.user?.id === "number" ? session.user.id : null;
                setUserId(currentUserId);
                if (currentUserId === null) clearLegacyCart();
                const savedCart = currentUserId === null ? null : readCart(currentUserId);
                if (savedCart?.restaurantId === loadedRestaurant.id) {
                    setCart(Object.fromEntries(savedCart.items.map((item) => [item.dishId, item.quantity])));
                } else {
                    setCart({});
                }
                setRestaurant(loadedRestaurant);
                setCartReady(true);
            } catch (reason) {
                if (!active || (reason instanceof Error && reason.name === "AbortError")) return;
                setError(reason instanceof Error ? reason.message : "Unable to load restaurant.");
            }
        };
        void loadRestaurant();
        return () => {
            active = false;
            controller.abort();
        };
    }, [params]);

    useEffect(() => {
        if (!restaurant || !cartReady) return;
        const items: CartItem[] = restaurant.dishes
            .filter((dish) => cart[dish.id])
            .map((dish) => ({ dishId: dish.id, name: dish.name, price: Number(dish.price), imageUrl: dish.imageUrl, quantity: cart[dish.id] }));
        if (userId === null || items.length === 0) return;
        writeCart(userId, { restaurantId: restaurant.id, restaurantName: restaurant.name, items });
    }, [cart, cartReady, restaurant, userId]);

    const visibleDishes = restaurant?.dishes.filter((dish) => dish.name.toLowerCase().includes(search.toLowerCase())) || [];
    const cartItems = restaurant?.dishes.filter((dish) => cart[dish.id]) || [];
    const itemCount = cartItems.reduce((sum, dish) => sum + cart[dish.id], 0);
    const total = cartItems.reduce((sum, dish) => sum + Number(dish.price) * cart[dish.id], 0);

    const changeQuantity = (dishId: number, delta: number) => {
        if (!cartReady) return;
        if (userId === null) {
            const returnTo = `${window.location.pathname}${window.location.search}`;
            router.push(`/login?next=${encodeURIComponent(returnTo)}`);
            return;
        }
        const nextQuantity = (cart[dishId] || 0) + delta;
        const next = { ...cart };
        if (nextQuantity <= 0) delete next[dishId];
        else next[dishId] = nextQuantity;
        setCart(next);
        if (Object.keys(next).length === 0) writeCart(userId, null);
    };

    const clearCart = () => {
        setCart({});
        setCartOpen(false);
        if (userId !== null) writeCart(userId, null);
    };

    const openCart = () => router.push("/cart");

    return (
        <div className="app">
            <Navbar />
            <main className="browse-main">
                <section className="browse-content">
                    <Link className="back-link" href="/restaurants">← All restaurants</Link>
                    {error && <p className="form-error">{error}</p>}
                    {!restaurant && !error && <p>Loading restaurant...</p>}
                    {restaurant && (
                        <>
                            <div className="restaurant-banner-frame">
                                {restaurant.imageUrl && !bannerFailed ? (
                                    <Image
                                        className="restaurant-banner"
                                        src={restaurant.imageUrl}
                                        alt=""
                                        width={1200}
                                        height={360}
                                        unoptimized
                                        onError={() => setBannerFailed(true)}
                                    />
                                ) : <div className="restaurant-banner restaurant-banner-fallback">🍽️</div>}
                            </div>
                            <h1>{restaurant.name}</h1>
                            <p className="browse-intro">{restaurant.location}</p>
                            {restaurant.latitude != null && restaurant.longitude != null && <LocationPicker latitude={String(restaurant.latitude)} longitude={String(restaurant.longitude)} readOnly onSelect={() => undefined} />}
                            <h2 className="menu-heading">Menu</h2>
                            <input className="dish-search" aria-label="Search this menu" placeholder="Search this menu..." value={search} onChange={(event) => setSearch(event.target.value)} />
                            {restaurant.dishes.length === 0 ? (
                                <p>This restaurant has not added any dishes yet.</p>
                            ) : (
                                <div className="menu-list">
                                    {visibleDishes.map((dish) => (
                                        <article className="dish-row" key={dish.id}>
                                            <div className="dish-image-frame">
                                                <div className="dish-image-fallback">🥘</div>
                                                {dish.imageUrl && (
                                                    <Image
                                                        src={dish.imageUrl}
                                                        alt=""
                                                        width={96}
                                                        height={96}
                                                        unoptimized
                                                        onError={(event) => { event.currentTarget.style.display = "none"; }}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <h2>{dish.name}</h2>
                                                <p>Freshly prepared at {restaurant.name}</p>
                                            </div>
                                            <div className="dish-actions">
                                                <strong>₹{Number(dish.price).toFixed(2)}</strong>
                                                {cart[dish.id] ? (
                                                    <div className="quantity-stepper" aria-label={`Quantity for ${dish.name}`}>
                                                        <button type="button" aria-label={`Remove one ${dish.name}`} onClick={() => changeQuantity(dish.id, -1)}>−</button>
                                                        <span>{cart[dish.id]}</span>
                                                        <button type="button" aria-label={`Add one ${dish.name}`} onClick={() => changeQuantity(dish.id, 1)}>+</button>
                                                    </div>
                                                ) : (
                                                    <button className="add-dish-button" type="button" onClick={() => changeQuantity(dish.id, 1)} disabled={!cartReady}>{cartReady && userId === null ? "Log in to add" : "Add"}</button>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                            {cartItems.length > 0 && (
                                <aside className={`cart-card ${cartOpen ? "cart-card-open" : ""}`}>
                                    {cartOpen && (
                                        <div className="cart-review">
                                            <div className="cart-review-heading">
                                                <h2>Your order</h2>
                                                <button type="button" className="cart-clear-button" onClick={clearCart}>Clear</button>
                                            </div>
                                            {cartItems.map((dish) => (
                                                <div className="cart-review-row" key={dish.id}>
                                                    <span>{cart[dish.id]} × {dish.name}</span>
                                                    <strong>₹{(Number(dish.price) * cart[dish.id]).toFixed(2)}</strong>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="cart-summary">
                                        <button type="button" className="cart-summary-details" onClick={() => setCartOpen((open) => !open)}>
                                            <span className="cart-count-badge">{itemCount}</span>
                                            <span><strong>{itemCount} {itemCount === 1 ? "item" : "items"}</strong><small>₹{total.toFixed(2)} total</small></span>
                                            <span className="cart-chevron">{cartOpen ? "⌃" : "⌄"}</span>
                                        </button>
                                        <button type="button" className="place-order-button" onClick={openCart}>View cart</button>
                                    </div>
                                </aside>
                            )}
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}
