import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "muncho-super-secret-jwt-key-2026";
const TOKEN_NAME = "token";

export interface UserPayload {
    userId: number;
    email: string;
    fullName: string;
}

export function signToken(payload: UserPayload, rememberMe: boolean = false): string {
    const expiresIn = rememberMe ? "30d" : "1d";
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): UserPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
        return decoded;
    } catch {
        return null;
    }
}

export { TOKEN_NAME };
