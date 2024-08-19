import { defineConfig } from 'drizzle-kit'
import { env } from './env'
const dbCon = env?.DB_CONNECTION;
export default defineConfig({
  schema: "./db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: dbCon,
  },
  verbose: true,
  strict: true,
})
