"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./restaurants.css";

type Restaurant = {
    id: number;
    name: string;
    location: string;
    imageUrl?: string;
};

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/restaurants")
            .then(async (response) => {
                if (!response.ok) throw new Error("Unable to load restaurants.");
                const data = await response.json();
                setRestaurants(data.restaurants);
            })
            .catch((reason: Error) => setError(reason.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="app">
            <Navbar />
            <main className="browse-main">
                <section className="browse-content">
                    <h1>Restaurants</h1>
                    <p className="browse-intro">Find your next favourite meal.</p>
                    {loading && <div className="restaurant-grid" aria-label="Loading restaurants">
                        {[1, 2, 3].map((item) => <div className="restaurant-card skeleton-card" key={item} />)}
                    </div>}
                    {error && <p className="form-error">{error}</p>}
                    {!loading && !error && restaurants.length === 0 && (
                        <p>No restaurants have been added yet.</p>
                    )}
                    <div className="restaurant-grid">
                        {restaurants.map((restaurant) => (
                            <Link className="restaurant-card" href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                                <span className="restaurant-card-image-frame">
                                    <span className="restaurant-card-icon" aria-hidden="true">🍽️</span>
                                    {restaurant.imageUrl && (
                                        <Image
                                            className="restaurant-card-image"
                                            src={restaurant.imageUrl}
                                            alt=""
                                            width={480}
                                            height={130}
                                            unoptimized
                                            onError={(event) => { event.currentTarget.style.display = "none"; }}
                                        />
                                    )}
                                </span>
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
