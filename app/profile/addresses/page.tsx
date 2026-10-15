"use client";

import { FormEvent, useEffect, useState } from "react";

type Address = {
    id: number;
    label: string;
    recipient_name: string;
    line_one: string;
    line_two?: string;
    city: string;
    postal_code: string;
};

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [form, setForm] = useState({ label: "Home", recipientName: "", lineOne: "", lineTwo: "", city: "", postalCode: "" });
    const [message, setMessage] = useState("");
    useEffect(() => { fetch("/api/addresses").then((response) => response.json()).then((data) => setAddresses(data.addresses || [])); }, []);
    const save = async (event: FormEvent) => { event.preventDefault(); const response = await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await response.json(); if (!response.ok) { setMessage(data.error); return; } setAddresses((current) => [data.address, ...current]); setForm({ label: "Home", recipientName: "", lineOne: "", lineTwo: "", city: "", postalCode: "" }); setMessage("Address saved."); };
    return <div className="saved-page"><p className="eyebrow">PROFILE</p><h1>Saved addresses</h1><p className="profile-lead">Keep delivery details ready for a faster checkout.</p><div className="saved-items">{addresses.map((item) => <article key={item.id}><strong>{item.label}</strong><p>{item.recipient_name}<br />{item.line_one}{item.line_two && `, ${item.line_two}`}<br />{item.city} · {item.postal_code}</p></article>)}</div><form className="saved-form profile-form" onSubmit={save}><h2>Add an address</h2><input required placeholder="Label e.g. Home" value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} /><input required placeholder="Recipient name" value={form.recipientName} onChange={(event) => setForm({ ...form, recipientName: event.target.value })} /><input required placeholder="Street address" value={form.lineOne} onChange={(event) => setForm({ ...form, lineOne: event.target.value })} /><input placeholder="Apartment, floor, landmark" value={form.lineTwo} onChange={(event) => setForm({ ...form, lineTwo: event.target.value })} /><div className="split-fields"><input required placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /><input required placeholder="Postal code" value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} /></div><button className="primary-button">Save address</button>{message && <p className="form-success">{message}</p>}</form></div>;
}
