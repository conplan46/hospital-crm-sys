import { Pool } from "pg";
import { env } from "~/env";

export const pool = new Pool({
	host: env.DB_HOST,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	port: parseInt(env.DB_PORT),
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});
