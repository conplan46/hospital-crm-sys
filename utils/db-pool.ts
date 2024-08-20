import { drizzle } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";
import { env } from "~/env";

const sslBool =
  env.NODE_ENV == "development" ||
  process.env.VERCEL_ENV == "preview" ||
  process.env.VERCEL_ENV == "development"
    ? true
    : true;

export const pool = new Pool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  max: 20,
  ssl: sslBool,
  //idleTimeoutMillis: 30000,
  //connectionTimeoutMillis: 2000,
});
export const clientExp = new Client({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: sslBool,
});

const client = await pool.connect();
export const db = drizzle(client);
