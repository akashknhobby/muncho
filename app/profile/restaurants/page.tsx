"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });

type Restaurant = {
    id: number;
    name: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
};

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [restaurantId, setRestaurantId] = useState("");
    const [restaurant, setRestaurant] = useState({ name: "", location: "", latitude: "", longitude: "", imageUrl: "" });
    const [dish, setDish] = useState({ name: "", price: "", imageUrl: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/restaurants?mine=true")
            .then(async (response) => {
                if (!response.ok) throw new Error("Please log in to manage restaurants.");
                const data = await response.json();
                setRestaurants(data.restaurants);
            })
            .catch((reason: Error) => setError(reason.message));
    }, []);

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            setError("Location services are not available in this browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => setRestaurant((current) => ({
                ...current,
                latitude: coords.latitude.toFixed(6),
                longitude: coords.longitude.toFixed(6),
                location: current.location || `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`,
            })),
            () => setError("Could not get your location. Enter it manually instead.")
        );
    };

    const selectLocation = (latitude: number, longitude: number) => {
        setRestaurant((current) => ({
            ...current,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            location: current.location || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        }));
    };

    const createRestaurant = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        const response = await fetch("/api/restaurants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(restaurant),
        });
        const data = await response.json();
        if (!response.ok) {
            setError(data.error || "Unable to create restaurant.");
            return;
        }
        setRestaurants((current) => [data.restaurant, ...current]);
        setRestaurantId(String(data.restaurant.id));
        setRestaurant({ name: "", location: "", latitude: "", longitude: "", imageUrl: "" });
        setMessage("Restaurant created. You can add dishes below.");
    };

    const addDish = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        const response = await fetch("/api/dishes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...dish, restaurantId }),
        });
        const data = await response.json();
        if (!response.ok) {
            setError(data.error || "Unable to add dish.");
            return;
        }
        setDish({ name: "", price: "", imageUrl: "" });
        setMessage(`Added ${data.dish.name} to the menu.`);
    };

    return (
        <div className="restaurant-onboarding">
            <h1>Restaurant onboarding</h1>
            <p>Be a restaurant owner and a customer with the same account.</p>
            {message && <p className="form-success">{message}</p>}
            {error && <p className="form-error">{error}</p>}

            <form onSubmit={createRestaurant} className="onboarding-form">
                <h2>Register a restaurant</h2>
                <label>Restaurant name<input required value={restaurant.name} onChange={(event) => setRestaurant({ ...restaurant, name: event.target.value })} /></label>
                <label>Banner image URL<input type="url" placeholder="https://..." value={restaurant.imageUrl} onChange={(event) => setRestaurant({ ...restaurant, imageUrl: event.target.value })} /></label>
                <label>Restaurant location<input required placeholder="Address or landmark" value={restaurant.location} onChange={(event) => setRestaurant({ ...restaurant, location: event.target.value })} /></label>
                <LocationPicker
                    latitude={restaurant.latitude}
                    longitude={restaurant.longitude}
                    onSelect={selectLocation}
                />
                <button type="button" onClick={useMyLocation}>Use my current location</button>
                <div className="coordinate-fields">
                    <label>Latitude<input value={restaurant.latitude} onChange={(event) => setRestaurant({ ...restaurant, latitude: event.target.value })} /></label>
                    <label>Longitude<input value={restaurant.longitude} onChange={(event) => setRestaurant({ ...restaurant, longitude: event.target.value })} /></label>
                </div>
                <button type="submit">Create restaurant</button>
            </form>

            {restaurants.length > 0 && (
                <>
                    <div className="owned-restaurants">
                        {restaurants.map((item) => <Link key={item.id} href={`/profile/restaurants/${item.id}`}>{item.name} dashboard →</Link>)}
                    </div>
                    <form onSubmit={addDish} className="onboarding-form">
                    <h2>Add a dish</h2>
                    <label>Restaurant<select required value={restaurantId} onChange={(event) => setRestaurantId(event.target.value)}>
                        <option value="">Select a restaurant</option>
                        {restaurants.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select></label>
                    <label>Dish name<input required value={dish.name} onChange={(event) => setDish({ ...dish, name: event.target.value })} /></label>
                    <label>Price<input required min="0" step="0.01" type="number" value={dish.price} onChange={(event) => setDish({ ...dish, price: event.target.value })} /></label>
                    <label>Dish image URL<input type="url" placeholder="https://..." value={dish.imageUrl} onChange={(event) => setDish({ ...dish, imageUrl: event.target.value })} /></label>
                    <button type="submit">Add dish</button>
                    </form>
                </>
            )}
        </div>
    );
}
