export type CartItem = {
    dishId: number;
    name: string;
    price: number;
    imageUrl?: string;
    quantity: number;
};

export type StoredCart = {
    restaurantId: number;
    restaurantName: string;
    items: CartItem[];
};

const LEGACY_CART_STORAGE_KEY = "muncho-cart";

export function clearLegacyCart() {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    } catch {
        // Storage may be unavailable in restricted browser contexts.
    }
}

export function cartStorageKey(userId: number): string {
    return `muncho-cart-user-${userId}`;
}

export function readCart(userId: number): StoredCart | null {
    if (typeof window === "undefined") return null;
    try {
        clearLegacyCart();
        const value = window.localStorage.getItem(cartStorageKey(userId));
        if (!value) return null;
        const cart: unknown = JSON.parse(value);
        if (!isStoredCart(cart)) {
            window.localStorage.removeItem(cartStorageKey(userId));
            return null;
        }
        return cart;
    } catch {
        return null;
    }
}

export function writeCart(userId: number, cart: StoredCart | null) {
    if (typeof window === "undefined") return;
    try {
        clearLegacyCart();
        if (!cart || cart.items.length === 0) {
            window.localStorage.removeItem(cartStorageKey(userId));
        } else {
            window.localStorage.setItem(cartStorageKey(userId), JSON.stringify(cart));
        }
    } catch (error) {
        console.error("Unable to save the cart:", error);
    }
}

function isStoredCart(value: unknown): value is StoredCart {
    if (typeof value !== "object" || value === null) return false;
    if (!("restaurantId" in value) || typeof value.restaurantId !== "number") return false;
    if (!("restaurantName" in value) || typeof value.restaurantName !== "string") return false;
    if (!("items" in value) || !Array.isArray(value.items)) return false;
    return value.items.every((item: unknown) => {
        if (typeof item !== "object" || item === null) return false;
        return (
            "dishId" in item &&
            typeof item.dishId === "number" &&
            "name" in item &&
            typeof item.name === "string" &&
            "price" in item &&
            typeof item.price === "number" &&
            "quantity" in item &&
            typeof item.quantity === "number" &&
            (!("imageUrl" in item) || typeof item.imageUrl === "string")
        );
    });
}
