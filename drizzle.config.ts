import { defineConfig } from 'drizzle-kit'
import { env } from '~/env';

const dbCon = env?.DB_CONNECTION;
export default defineConfig({
  schema: "./drizzle/schema.ts",
   out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DB_CONNECTION,
  },
  verbose: true,
  strict: true,
})
