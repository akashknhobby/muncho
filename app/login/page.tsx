"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { notifyAuthChanged } from "../../lib/auth-events";
import "./page.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, rememberMe }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Login failed.");
                return;
            }
            notifyAuthChanged();
            const next = new URLSearchParams(window.location.search).get("next");
            const destination = next ? new URL(next, window.location.origin) : null;
            router.replace(
                destination?.origin === window.location.origin
                    ? `${destination.pathname}${destination.search}${destination.hash}`
                    : "/"
            );
            router.refresh();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Unable to log in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-main">
            <section className="auth-panel">
                <p className="auth-brand">Muncho</p>
                <h1>Welcome back!</h1>
                <p className="auth-intro">Log in to continue ordering delicious food.</p>
                {error && <p className="auth-error" role="alert">{error}</p>}
                <form className="auth-form" onSubmit={handleSubmit}>
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
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                        />
                    </label>
                    <label className="auth-checkbox">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(event) => setRememberMe(event.target.checked)}
                        />
                        Remember me
                    </label>
                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>
                <p className="auth-footnote">
                    Don&apos;t have an account? <Link href="/signup">Sign up instead</Link>
                </p>
            </section>
            <div className="auth-banner">
                <Image src="/burger.png" alt="Freshly prepared burger" fill sizes="(max-width: 760px) 0vw, 45vw" />
            </div>
        </main>
    );
}
