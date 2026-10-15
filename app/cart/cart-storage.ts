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

export const CART_STORAGE_KEY = "muncho-cart";

export function readCart(): StoredCart | null {
    if (typeof window === "undefined") return null;
    try {
        const value = window.localStorage.getItem(CART_STORAGE_KEY);
        return value ? JSON.parse(value) as StoredCart : null;
    } catch {
        return null;
    }
}

export function writeCart(cart: StoredCart | null) {
    if (typeof window === "undefined") return;
    if (!cart || cart.items.length === 0) window.localStorage.removeItem(CART_STORAGE_KEY);
    else window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}
