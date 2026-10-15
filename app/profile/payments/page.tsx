"use client";

import { FormEvent, useEffect, useState } from "react";

type PaymentMethod = {
    id: number;
    brand: string;
    last_four: string;
    expiry_month: number;
    expiry_year: number;
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState<PaymentMethod[]>([]);
    const [form, setForm] = useState({ number: "", brand: "visa", expiryMonth: "", expiryYear: "" });
    const [message, setMessage] = useState("");
    useEffect(() => { fetch("/api/payment-methods").then((response) => response.json()).then((data) => setPayments(data.paymentMethods || [])); }, []);
    const save = async (event: FormEvent) => { event.preventDefault(); const digits = form.number.replace(/\D/g, ""); const response = await fetch("/api/payment-methods", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand: form.brand, lastFour: digits.slice(-4), expiryMonth: form.expiryMonth, expiryYear: form.expiryYear }) }); const data = await response.json(); if (!response.ok) { setMessage(data.error); return; } setPayments((current) => [data.paymentMethod, ...current]); setForm({ number: "", brand: "visa", expiryMonth: "", expiryYear: "" }); setMessage("Payment method saved securely."); };
    return <div className="saved-page"><p className="eyebrow">PROFILE</p><h1>Payment methods</h1><p className="profile-lead">Your full card number and CVV are never stored by Muncho.</p><div className="saved-items">{payments.map((item) => <article key={item.id}><strong>{item.brand.toUpperCase()} •••• {item.last_four}</strong><p>Expires {String(item.expiry_month).padStart(2, "0")}/{item.expiry_year}</p></article>)}</div><form className="saved-form profile-form" onSubmit={save}><h2>Add a card</h2><input required inputMode="numeric" placeholder="Card number" value={form.number} onChange={(event) => setForm({ ...form, number: event.target.value })} /><div className="split-fields"><select value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })}><option value="visa">Visa</option><option value="mastercard">Mastercard</option><option value="amex">Amex</option></select><input required type="number" min="1" max="12" placeholder="Month" value={form.expiryMonth} onChange={(event) => setForm({ ...form, expiryMonth: event.target.value })} /><input required type="number" placeholder="Year" value={form.expiryYear} onChange={(event) => setForm({ ...form, expiryYear: event.target.value })} /></div><p className="security-note">Only masked payment metadata is saved.</p><button className="primary-button">Save card</button>{message && <p className="form-success">{message}</p>}</form></div>;
}
