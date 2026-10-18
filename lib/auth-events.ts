const AUTH_CHANGE_STORAGE_KEY = "muncho-auth-changed";

export function notifyAuthChanged() {
    try {
        window.localStorage.setItem(AUTH_CHANGE_STORAGE_KEY, String(Date.now()));
    } catch (error) {
        console.error("Unable to notify other tabs about the login change:", error);
    }
}

export function isAuthChangeEvent(event: StorageEvent) {
    return event.key === AUTH_CHANGE_STORAGE_KEY;
}
