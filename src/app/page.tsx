"use client";
import { atom } from "jotai";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {

  //console.log({ session });
  return <main className="flex min-h-screen text-white"></main>;
}
