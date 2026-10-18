"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../login/page.css";

export default function Signup() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!agreeTerms) {
            setError("Please accept the terms and conditions to proceed.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Signup failed.");
                return;
            }
            router.push("/");
            router.refresh();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Unable to sign up.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-main">
            <section className="auth-panel">
                <p className="auth-brand">Muncho</p>
                <h1>Create an account</h1>
                <p className="auth-intro">Sign up to start ordering delicious food.</p>
                {error && <p className="auth-error" role="alert">{error}</p>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="auth-field">
                        Full name
                        <input
                            type="text"
                            autoComplete="name"
                            required
                            minLength={2}
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            placeholder="Enter your full name"
                        />
                    </label>
                    <label className="auth-field">
                        Email
                        <input
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter your email"
                        />
                    </label>
                    <label className="auth-field">
                        Password
                        <input
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Create a password"
                        />
                    </label>
                    <label className="auth-checkbox">
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(event) => setAgreeTerms(event.target.checked)}
                        />
                        I agree to the terms and conditions
                    </label>
                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? "Signing up..." : "Sign up"}
                    </button>
                </form>
                <p className="auth-footnote">
                    Already have an account? <Link href="/login">Log in instead</Link>
                </p>
            </section>
            <div className="auth-banner">
                <Image src="/burger.png" alt="Freshly prepared burger" fill sizes="(max-width: 760px) 0vw, 45vw" />
            </div>
        </main>
    );
}
