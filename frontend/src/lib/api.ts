export type Role = "CUSTOMER" | "RESTAURANT_OWNER" | "DELIVERY_WORKER"

export type User = {
  id: number
  email: string
  fullName: string
  phone?: string
  role: Role
  available?: boolean
}

export type Dish = {
  id: number
  restaurantId: number
  restaurantName?: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  category?: string
  available: boolean
  preparationTimeMinutes?: number
}

export type Restaurant = {
  id: number
  name: string
  description?: string
  cuisine?: string
  address?: string
  phone?: string
  imageUrl?: string
  operatingHours?: string
  available: boolean
  dishesCount?: number
  dishes?: Dish[]
}

export type OrderItem = {
  id?: number
  dishId?: number
  dishName?: string
  quantity: number
  unitPrice?: number
  subtotal?: number
}

export type Order = {
  id: number
  orderNumber: string
  customerName?: string
  customerPhone?: string
  restaurantId: number
  restaurantName: string
  restaurantAddress?: string
  deliveryWorkerId?: number
  deliveryWorkerName?: string
  status: string
  paymentStatus?: string
  paymentMethod?: string
  deliveryAddress: string
  subtotal: number
  deliveryFee: number
  tax: number
  totalAmount: number
  failureReason?: string
  items: OrderItem[]
  createdAt?: string
}

export type CartItem = { dish: Dish; quantity: number }

const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8080"
const tokenKey = "muncho_token"

export function getToken() {
  return localStorage.getItem(tokenKey)
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(tokenKey, token)
  else localStorage.removeItem(tokenKey)
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set("Content-Type", "application/json")
  const token = getToken()
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const response = await fetch(`${baseUrl}${path}`, { ...init, headers })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed (${response.status})`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: Record<string, string>) =>
    request<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => request<User>("/api/auth/me"),
  restaurants: (search = "") =>
    request<Restaurant[]>(`/api/restaurants${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  restaurant: (id: string | number) => request<Restaurant>(`/api/restaurants/${id}`),
  dishes: (search = "") =>
    request<Dish[]>(`/api/dishes${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  restaurantDishes: (id: number) => request<Dish[]>(`/api/restaurants/${id}/dishes`),
  preview: (restaurantId: number, items: CartItem[]) =>
    request<{ subtotal: number; deliveryFee: number; tax: number; totalAmount: number }>(
      "/api/customer/checkout/preview",
      { method: "POST", body: JSON.stringify({ restaurantId, items: items.map(({ dish, quantity }) => ({ dishId: dish.id, quantity })) }) },
    ),
  createOrder: (payload: object) =>
    request<Order>("/api/customer/orders", { method: "POST", body: JSON.stringify(payload) }),
  customerOrders: () => request<Order[]>("/api/customer/orders"),
  customerOrder: (id: string) => request<Order>(`/api/customer/orders/${id}`),
  sharedOrder: (id: string) => request<Order>(`/api/orders/${id}`),
  dish: (id: string | number) => request<Dish>(`/api/dishes/${id}`),
  ownerRestaurants: () => request<Restaurant[]>("/api/owner/restaurants"),
  createRestaurant: (payload: object) =>
    request<Restaurant>("/api/owner/restaurants", { method: "POST", body: JSON.stringify(payload) }),
  ownerRestaurant: (id: string) => request<Restaurant>(`/api/owner/restaurants/${id}`),
  updateRestaurant: (id: number, payload: object) =>
    request<Restaurant>(`/api/owner/restaurants/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  ownerAvailability: (id: number, available: boolean) =>
    request<Restaurant>(`/api/owner/restaurants/${id}/availability`, { method: "PATCH", body: JSON.stringify({ available }) }),
  ownerOrders: (restaurantId: number) => request<Order[]>(`/api/owner/restaurants/${restaurantId}/orders`),
  ownerOrder: (id: string) => request<Order>(`/api/owner/orders/${id}`),
  ownerStatus: (id: number, status: string) =>
    request<Order>(`/api/owner/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  workers: () => request<User[]>("/api/owner/delivery-workers/eligible"),
  assignWorker: (orderId: number, deliveryWorkerId: number) =>
    request<Order>(`/api/owner/orders/${orderId}/assign-delivery`, { method: "POST", body: JSON.stringify({ deliveryWorkerId }) }),
  deleteDish: (id: number) => request<void>(`/api/owner/dishes/${id}`, { method: "DELETE" }),
  createDish: (restaurantId: number, payload: object) =>
    request<Dish>(`/api/owner/restaurants/${restaurantId}/dishes`, { method: "POST", body: JSON.stringify(payload) }),
  updateDish: (id: number, payload: object) =>
    request<Dish>(`/api/owner/dishes/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deliveryOrders: () => request<Order[]>("/api/delivery/orders"),
  deliveryOrder: (id: string) => request<Order>(`/api/delivery/orders/${id}`),
  deliveryStatus: (id: number, status: string, failureReason?: string) =>
    request<Order>(`/api/delivery/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, failureReason }) }),
}
