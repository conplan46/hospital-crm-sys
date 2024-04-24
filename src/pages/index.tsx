import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";
import { Layout } from "~/components/layout";
export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: router?.asPath });
  }
  console.log({ session })
  return (
    <Layout>

      <main className="flex min-h-screen flex-col w-full items-center justify-center ">
      </main>
    </Layout>
  );
}
