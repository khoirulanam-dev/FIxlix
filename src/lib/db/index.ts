import * as dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

// Eliminate pg-connection-string warning that triggers Next.js dev error overlay
if (connectionString.includes("sslmode=") && !connectionString.includes("uselibpqcompat=")) {
  connectionString = connectionString.replace(/sslmode=(require|prefer|verify-ca)/g, "uselibpqcompat=true&sslmode=$1");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
});

export const db = drizzle(pool, { schema });
export { pool };
