'use client'
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomePage() {

  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: usePathname() });
  }
  console.log({ session })
  return (
    <main className="flex min-h-screen text-white">
    </main>
  );
}
