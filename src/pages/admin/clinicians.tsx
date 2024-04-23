import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";
import { AdminLayout } from "~/components/admin-layout";
export default function Clinicians() {
  const router = useRouter()
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: router?.asPath });
  }
  console.log({ session })
  return (
    <AdminLayout>

      <main className="flex min-h-screen flex-col w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Button onClick={() => { void signOut() }}>logout</Button>
      </main>
    </AdminLayout>
  );
}
