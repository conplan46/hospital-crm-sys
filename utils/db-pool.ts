//import { drizzle } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Client, Pool } from "pg";
import { env } from "~/env";
import { PrismaClient } from "@prisma/client";
const sslBool =
  env.NODE_ENV == "development" ||
  process.env.VERCEL_ENV == "preview" ||
  process.env.VERCEL_ENV == "development"
    ? true
    : true;

//export const pool = new Pool({
//  host: env.DB_HOST,
//  user: env.DB_USER,
//  password: env.DB_PASSWORD,
//  database: env.DB_NAME,
//  max: 20,
//  ssl: sslBool,
//  //idleTimeoutMillis: 30000,
//  //connectionTimeoutMillis: 2000,
//});
export const pool = new Pool({
  connectionString: env?.DB_CONNECTION,
  max: 20,
  ssl: sslBool,
});
//export const db = drizzle(client);
const sql = neon(env?.DB_CONNECTION);
export const db = drizzle(sql, { logger: true });

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
