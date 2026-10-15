import { cookies } from "next/headers";
import { TOKEN_NAME, verifyToken, UserPayload } from "@/lib/auth";

export async function getCurrentUser(): Promise<UserPayload | null> {
    const token = (await cookies()).get(TOKEN_NAME)?.value;
    return token ? verifyToken(token) : null;
}
