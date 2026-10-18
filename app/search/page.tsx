"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../restaurants/restaurants.css";

type Restaurant = { id: number; name: string; location: string };

export default function SearchPage() {
    const [search, setSearch] = useState("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const runSearch = async (event?: FormEvent) => {
        event?.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`/api/restaurants?search=${encodeURIComponent(search)}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Search is unavailable right now.");
            setRestaurants(data.restaurants || []);
            setSearched(true);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Search is unavailable right now.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        fetch("/api/restaurants")
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Search is unavailable right now.");
                if (!active) return;
                setRestaurants(data.restaurants || []);
                setSearched(true);
            })
            .catch((reason: unknown) => {
                if (!active) return;
                setError(reason instanceof Error ? reason.message : "Search is unavailable right now.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, []);

    return (
        <div className="app">
            <Navbar />
            <main className="browse-main">
                <section className="browse-content">
                    <h1>Search restaurants</h1>
                    <form className="search-form" onSubmit={runSearch}>
                        <input
                            aria-label="Search restaurants"
                            placeholder="Search by restaurant or location"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                    {search && !loading && <p className="search-summary">{restaurants.length} restaurant{restaurants.length === 1 ? "" : "s"} found for “{search}”</p>}
                    {error && <p className="form-error">{error}</p>}
                    {loading && <p>Searching...</p>}
                    {!loading && searched && restaurants.length === 0 && <p>No matching restaurants found.</p>}
                    <div className="restaurant-grid">
                        {restaurants.map((restaurant) => (
                            <Link className="restaurant-card" href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                                <span className="restaurant-card-icon">🍽️</span>
                                <h2>{restaurant.name}</h2>
                                <p>{restaurant.location}</p>
                                <span className="restaurant-card-link">View menu →</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
