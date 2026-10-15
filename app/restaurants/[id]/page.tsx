"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../restaurants.css";
import dynamic from "next/dynamic";
import { readCart, writeCart, CartItem } from "../../cart/cart-storage";

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

    useEffect(() => {
        params.then(({ id }) =>
            fetch(`/api/restaurants/${id}`)
                .then(async (response) => {
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || "Unable to load restaurant.");
                    setRestaurant(data.restaurant);
                })
                .catch((reason: Error) => setError(reason.message))
        );
    }, [params]);

    useEffect(() => {
        if (!restaurant) return;
        try {
        const savedCart = readCart();
        if (savedCart?.restaurantId === restaurant.id) {
            setCart(Object.fromEntries(savedCart.items.map((item) => [item.dishId, item.quantity])));
        }
        } catch {
            setError("Your saved cart could not be restored.");
        } finally {
            setCartReady(true);
        }
    }, [restaurant]);

    useEffect(() => {
        if (!restaurant || !cartReady) return;
        const items: CartItem[] = restaurant.dishes
            .filter((dish) => cart[dish.id])
            .map((dish) => ({ dishId: dish.id, name: dish.name, price: Number(dish.price), imageUrl: dish.imageUrl, quantity: cart[dish.id] }));
        writeCart({ restaurantId: restaurant.id, restaurantName: restaurant.name, items });
    }, [cart, cartReady, restaurant]);

    const visibleDishes = restaurant?.dishes.filter((dish) => dish.name.toLowerCase().includes(search.toLowerCase())) || [];
    const cartItems = restaurant?.dishes.filter((dish) => cart[dish.id]) || [];
    const itemCount = cartItems.reduce((sum, dish) => sum + cart[dish.id], 0);
    const total = cartItems.reduce((sum, dish) => sum + Number(dish.price) * cart[dish.id], 0);

    const changeQuantity = (dishId: number, delta: number) => {
        setCart((current) => {
            const nextQuantity = (current[dishId] || 0) + delta;
            const next = { ...current };
            if (nextQuantity <= 0) delete next[dishId];
            else next[dishId] = nextQuantity;
            return next;
        });
    };

    const clearCart = () => {
        setCart({});
        setCartOpen(false);
    };

    const openCart = () => { window.location.href = "/cart"; };

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
                            {restaurant.imageUrl ? <img className="restaurant-banner" src={restaurant.imageUrl} alt="" /> : <div className="restaurant-banner restaurant-banner-fallback">🍽️</div>}
                            <h1>{restaurant.name}</h1>
                            <p className="browse-intro">{restaurant.location}</p>
                            {restaurant.latitude && restaurant.longitude && <LocationPicker latitude={String(restaurant.latitude)} longitude={String(restaurant.longitude)} readOnly onSelect={() => undefined} />}
                            <h2 className="menu-heading">Menu</h2>
                            <input className="dish-search" placeholder="Search this menu..." value={search} onChange={(event) => setSearch(event.target.value)} />
                            {restaurant.dishes.length === 0 ? (
                                <p>This restaurant has not added any dishes yet.</p>
                            ) : (
                                <div className="menu-list">
                                    {visibleDishes.map((dish) => (
                                        <article className="dish-row" key={dish.id}>
                                            {dish.imageUrl ? <img src={dish.imageUrl} alt="" /> : <div className="dish-image-fallback">🥘</div>}
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
                                                    <button className="add-dish-button" type="button" onClick={() => changeQuantity(dish.id, 1)}>Add</button>
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
