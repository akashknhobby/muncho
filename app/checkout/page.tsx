"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { readCart, writeCart } from "../cart/cart-storage";
import "../restaurants/restaurants.css";

type Address = {
    id: number;
    label: string;
    recipient_name: string;
    line_one: string;
    line_two?: string;
    city: string;
    postal_code: string;
};

type Payment = {
    id: number;
    brand: string;
    last_four: string;
    expiry_month: number;
    expiry_year: number;
};

const emptyAddress = {
    label: "Home",
    recipientName: "",
    lineOne: "",
    lineTwo: "",
    city: "",
    postalCode: "",
};

export default function CheckoutPage() {
    const [cart, setCart] = useState<ReturnType<typeof readCart> | undefined>(undefined);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [addressId, setAddressId] = useState("");
    const [paymentId, setPaymentId] = useState("");
    const [showAddress, setShowAddress] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [address, setAddress] = useState(emptyAddress);
    const [card, setCard] = useState({ number: "", brand: "visa", expiryMonth: "", expiryYear: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [savingPayment, setSavingPayment] = useState(false);
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        let active = true;
        const controller = new AbortController();
        const loadCheckoutOptions = async () => {
            try {
                const sessionResponse = await fetch("/api/auth/me", { signal: controller.signal });
                const sessionData = await sessionResponse.json();
                if (!sessionResponse.ok) {
                    throw new Error(sessionData.error || "Unable to check your login status.");
                }
                if (!active) return;
                if (typeof sessionData.user?.id !== "number") {
                    const returnTo = `${window.location.pathname}${window.location.search}`;
                    router.replace(`/login?next=${encodeURIComponent(returnTo)}`);
                    return;
                }
                const currentUserId = sessionData.user.id;
                setUserId(currentUserId);
                setCart(readCart(currentUserId));

                const [addressResponse, paymentResponse] = await Promise.all([
                    fetch("/api/addresses", { signal: controller.signal }),
                    fetch("/api/payment-methods", { signal: controller.signal }),
                ]);
                if (!addressResponse.ok || !paymentResponse.ok) {
                    throw new Error("Please log in to continue checkout.");
                }
                const [addressData, paymentData] = await Promise.all([
                    addressResponse.json(),
                    paymentResponse.json(),
                ]);
                if (!active) return;
                const savedAddresses: Address[] = addressData.addresses || [];
                const savedPayments: Payment[] = paymentData.paymentMethods || [];
                setAddresses(savedAddresses);
                setPayments(savedPayments);
                if (savedAddresses[0]) setAddressId(String(savedAddresses[0].id));
                if (savedPayments[0]) setPaymentId(String(savedPayments[0].id));
            } catch (reason) {
                if (!active || (reason instanceof Error && reason.name === "AbortError")) return;
                setError(reason instanceof Error ? reason.message : "Unable to load checkout options.");
                setCart(null);
            }
        };

        void loadCheckoutOptions();
        return () => {
            active = false;
            controller.abort();
        };
    }, [router]);

    const saveAddress = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSavingAddress(true);
        try {
            const response = await fetch("/api/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(address),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Unable to save address.");
            setAddresses((current) => [data.address, ...current]);
            setAddressId(String(data.address.id));
            setAddress(emptyAddress);
            setShowAddress(false);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Unable to save address.");
        } finally {
            setSavingAddress(false);
        }
    };

    const savePayment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSavingPayment(true);
        const digits = card.number.replace(/\D/g, "");
        try {
            const response = await fetch("/api/payment-methods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    brand: card.brand,
                    lastFour: digits.slice(-4),
                    expiryMonth: card.expiryMonth,
                    expiryYear: card.expiryYear,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Unable to save payment method.");
            setPayments((current) => [data.paymentMethod, ...current]);
            setPaymentId(String(data.paymentMethod.id));
            setCard({ number: "", brand: "visa", expiryMonth: "", expiryYear: "" });
            setShowPayment(false);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Unable to save payment method.");
        } finally {
            setSavingPayment(false);
        }
    };

    const placeOrder = async () => {
        if (!cart || userId === undefined || !addressId || !paymentId) {
            setError("Choose a delivery address and payment method.");
            return;
        }
        setError("");
        setSubmitting(true);
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    restaurantId: cart.restaurantId,
                    addressId,
                    paymentMethodId: paymentId,
                    items: cart.items.map((item) => ({
                        dishId: item.dishId,
                        quantity: item.quantity,
                    })),
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Unable to place order.");
            writeCart(userId, null);
            router.push(`/order-complete?id=${data.orderId}`);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Unable to place order.");
            setSubmitting(false);
        }
    };

    const total = cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

    return (
        <div className="app">
            <Navbar />
            <main className="browse-main">
                <section className="checkout-shell">
                    <Link className="back-link" href="/cart">← Back to cart</Link>
                    <p className="eyebrow">CHECKOUT</p>
                    <h1>Almost there</h1>
                    {error && <p className="form-error" role="alert">{error}</p>}
                    {cart === undefined ? (
                        <p aria-live="polite">Loading your checkout...</p>
                    ) : !cart?.items.length ? (
                        <div className="empty-panel">
                            <h2>Your cart is empty</h2>
                            <Link className="primary-link" href="/restaurants">Browse restaurants</Link>
                        </div>
                    ) : (
                        <div className="checkout-grid">
                            <div className="checkout-form-card">
                                <section>
                                    <div className="checkout-section-heading">
                                        <div><span className="step-number">1</span><h2>Delivery address</h2></div>
                                        <button type="button" className="text-button" onClick={() => setShowAddress((value) => !value)}>+ Add new</button>
                                    </div>
                                    {addresses.length ? (
                                        <select aria-label="Delivery address" value={addressId} onChange={(event) => setAddressId(event.target.value)}>
                                            <option value="">Choose an address</option>
                                            {addresses.map((item) => (
                                                <option key={item.id} value={item.id}>{item.label} · {item.line_one}, {item.city}</option>
                                            ))}
                                        </select>
                                    ) : <p className="muted-text">Add an address to continue.</p>}
                                    {showAddress && (
                                        <form className="saved-form" onSubmit={saveAddress}>
                                            {(["label", "recipientName", "lineOne", "lineTwo", "city", "postalCode"] as const).map((key) => (
                                                <input
                                                    key={key}
                                                    required={key !== "lineTwo"}
                                                    autoComplete={key === "lineOne" ? "street-address" : key === "postalCode" ? "postal-code" : "off"}
                                                    placeholder={key === "lineOne" ? "Street address" : key === "recipientName" ? "Recipient name" : key === "postalCode" ? "Postal code" : key[0].toUpperCase() + key.slice(1)}
                                                    value={address[key]}
                                                    onChange={(event) => setAddress({ ...address, [key]: event.target.value })}
                                                />
                                            ))}
                                            <button className="primary-button" type="submit" disabled={savingAddress}>{savingAddress ? "Saving..." : "Save address"}</button>
                                        </form>
                                    )}
                                </section>
                                <section>
                                    <div className="checkout-section-heading">
                                        <div><span className="step-number">2</span><h2>Payment method</h2></div>
                                        <button type="button" className="text-button" onClick={() => setShowPayment((value) => !value)}>+ Add card</button>
                                    </div>
                                    {payments.length ? (
                                        <select aria-label="Payment method" value={paymentId} onChange={(event) => setPaymentId(event.target.value)}>
                                            <option value="">Choose a payment method</option>
                                            {payments.map((item) => (
                                                <option key={item.id} value={item.id}>{item.brand.toUpperCase()} ending in {item.last_four}</option>
                                            ))}
                                        </select>
                                    ) : <p className="muted-text">Add a card to continue. Card details are stored securely as masked metadata only.</p>}
                                    {showPayment && (
                                        <form className="saved-form" onSubmit={savePayment}>
                                            <input required inputMode="numeric" autoComplete="cc-number" placeholder="Card number" value={card.number} onChange={(event) => setCard({ ...card, number: event.target.value })} />
                                            <div className="split-fields">
                                                <select aria-label="Card brand" value={card.brand} onChange={(event) => setCard({ ...card, brand: event.target.value })}>
                                                    <option value="visa">Visa</option>
                                                    <option value="mastercard">Mastercard</option>
                                                    <option value="amex">Amex</option>
                                                </select>
                                                <input required autoComplete="cc-exp-month" placeholder="Expiry month" type="number" min="1" max="12" value={card.expiryMonth} onChange={(event) => setCard({ ...card, expiryMonth: event.target.value })} />
                                                <input required autoComplete="cc-exp-year" placeholder="Expiry year" type="number" min={new Date().getFullYear()} value={card.expiryYear} onChange={(event) => setCard({ ...card, expiryYear: event.target.value })} />
                                            </div>
                                            <p className="security-note">We never store your full card number or CVV.</p>
                                            <button className="primary-button" type="submit" disabled={savingPayment}>{savingPayment ? "Saving..." : "Save card"}</button>
                                        </form>
                                    )}
                                </section>
                            </div>
                            <aside className="cart-total-card">
                                <span>{cart.restaurantName}</span>
                                <strong>₹{total.toFixed(2)}</strong>
                                <small>{cart.items.length} different item{cart.items.length === 1 ? "" : "s"}</small>
                                <button className="place-order-button checkout-link" disabled={submitting} onClick={placeOrder}>
                                    {submitting ? "Placing order..." : "Place order"}
                                </button>
                            </aside>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
