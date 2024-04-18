import { Pool } from "pg";
import { env } from "~/env";

const sslBool =
	env.NODE_ENV == "development" ||
		process.env.VERCEL_ENV == "preview" ||
		process.env.VERCEL_ENV == "development"
		? false : true;

export const pool = new Pool({
	host: env.DB_HOST,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	port: parseInt(env.DB_PORT),
	max: 20,
	ssl: sslBool,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});
