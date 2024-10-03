"use client";
import { useQuery } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NoPriv from "~/components/no-privilages";
import Loading from "../loading";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const callBackUrl = usePathname();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: callBackUrl });
  }

  if (status === "loading") {
    return (
      <>
        <Loading />
        <h1>Authenticating</h1>
      </>
    )
  }
  const isAdminQuery = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const res = await fetch("/api/is-admin", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
        method: "POST",
      });
      /* :{ status: string; data: UserData } */
      const data = (await res.json()) as { status: string; isAdmin: boolean };
      console.log(data);
      return data.isAdmin;
    },
  });

  if (isClient && isAdminQuery?.data && isAdminQuery?.isFetched) {
    return (
      <section>{children}</section>
    );
  } else if (!isAdminQuery?.data && isClient && isAdminQuery.isFetched) {
    return <NoPriv />;
  }
}
