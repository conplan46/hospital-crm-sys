/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import type { QueryResult } from "pg";
import PostgresAdapter from "@auth/pg-adapter";
import { compareSync } from "bcrypt-ts";
import { type GetServerSidePropsContext } from "next";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Pool } from "pg";
import { env } from "~/env";
import { pool } from "utils/db-pool";
import { User } from "utils/used-types";
type Credentials = { email: string; password: string };
const debug =
  env.NODE_ENV == "development" ||
  process.env.VERCEL_ENV == "preview" ||
  process.env.VERCEL_ENV == "development"
    ? true
    : false;

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
        session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },

  debug: debug,
  session: debug ? { strategy: "jwt" } : { strategy: "jwt", maxAge: 30 * 60 },
  adapter: PostgresAdapter(pool) as Adapter,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const result = await pool.query(
          "SELECT * FROM users WHERE EMAIL = $1",
          [credentials?.email],
        );

        // If no error and we have user data, return it
        if (credentials) {
          const hashCompRes = compareSync(
            credentials.password,
            result?.rows?.[0]?.password as string,
          );

          if (result.rows[0] && hashCompRes) {
            return result?.rows[0];
          }
          // Return null if user data could not be retrieved
          return null;
        }
      },
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/new-user",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
