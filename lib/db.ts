import { Pool, QueryResult, QueryResultRow } from "pg";

const globalForPg = globalThis as unknown as {
    pool: Pool | undefined;
};

export const pool =
    globalForPg.pool ??
    new Pool({
        connectionString: process.env.DATABASE_URL,
    });

if (process.env.NODE_ENV !== "production") {
    globalForPg.pool = pool;
}

export async function query<T extends QueryResultRow = any>(
    text: string,
    params?: any[]
): Promise<QueryResult<T>> {
    return pool.query<T>(text, params);
}

export default pool;
