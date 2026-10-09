"use client";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!agreeTerms) {
            setError("Please accept the Terms and conditions to proceed");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Signup failed");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err: any) {
            setError(err?.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className="fo">
                <p style={{ fontWeight: "bold", fontSize: "24px", margin: "0 0 10px 0" }}>Muncho</p>
                <p style={{ fontSize: "20px", fontWeight: 600, margin: "0 0 6px 0" }}>Create an account</p>
                <p style={{ color: "#666", marginBottom: "20px" }}>Sign up to start ordering delicious food.</p>

                {error && (
                    <div style={{ color: "#e11d48", backgroundColor: "#ffe4e6", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", minWidth: "280px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1F2523", marginBottom: "6px" }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1F2523", marginBottom: "6px" }}>
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1F2523", marginBottom: "6px" }}>
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#FF9E4F" }}
                        />
                        <label htmlFor="terms" style={{ fontSize: "13px", color: "#444", cursor: "pointer" }}>
                            Terms and conditions
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: "8px",
                            padding: "12px",
                            backgroundColor: "#FF9E4F",
                            color: "white",
                            fontWeight: "bold",
                            border: "none",
                            borderRadius: "8px",
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "12px", fontSize: "14px" }}>
                        <span style={{ color: "#666" }}>Already have an account?</span>
                        <Link
                            href="/login"
                            style={{
                                color: "#FF9E4F",
                                fontWeight: 600,
                                textDecoration: "none"
                            }}
                        >
                            Log in instead
                        </Link>
                    </div>
                </form>
            </div>
            <div className="banner">
                <img src="/burger.png" alt="Burger Banner" />
            </div>
        </main>
    );
}
