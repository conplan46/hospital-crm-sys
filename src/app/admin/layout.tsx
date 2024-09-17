"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NoPriv from "~/components/no-privilages";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { data: session, status } = useSession();
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
  if (isClient && isAdminQuery?.data && isAdminQuery.isFetched) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  } else if (!isAdminQuery?.data && isClient && isAdminQuery.isFetched) {
    return <NoPriv />;
  }
}
