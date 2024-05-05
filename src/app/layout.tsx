import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { atom, useAtom } from "jotai";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"
import { FaCog } from "react-icons/fa"
import { Clinician, Patient } from "utils/used-types";
import { Metadata } from "next";
import { Providers } from "./providers";
import { getServerAuthSession } from "~/server/auth";
import LogoutButton from "~/components/logout-button";
type Response = { userData: Patient | Clinician | undefined, status: string | undefined }
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const metadata: Metadata = {
  title: "Hospital CRM",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession()
  return (
    <html lang="en" data-theme="light">
      <body>
        <Providers session={session}>
          <div className="navbar bg-base-100">

            <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <div className="flex-1">
              <a className="btn btn-ghost text-xl">Hospital CRM</a>
            </div>
            <div className="flex-none gap-2">
              <div className="form-control">
                <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
              </div>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li>
                    <Link href="/profile" className="justify-between">
                      Profile
                    </Link>
                  </li>
                  <LogoutButton />
                </ul>
              </div>
            </div>
          </div>
          <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col ">
              {/* Page content here */}
              <main className="m-2">{children}</main>

            </div>
            <div className="drawer-side">
              <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                {/* Sidebar content here */}
                <Link href="/admin/manage-labels">
                  <li
                    className={`m-2 flex rounded-xl bg-[#ffffff] p-4 "
                      ? "border-gradient border-2"
                      : ""
                      }`}
                    style={{ width: "100%" }}
                  >
                    <p className="flex items-center gap-3 text-lg font-bold">
                      <FaCog /> Labels
                    </p>
                  </li>
                </Link>
                <Link href="/admin/manage-labels">
                  <li
                    className={`m-2  flex rounded-xl bg-[#ffffff] p-4 "
                      ? "border-gradient border-2"
                      : ""
                      }`}
                    style={{ width: "100%" }}
                  >
                    <p className="flex items-center gap-3 text-lg font-bold">
                      <FaCog /> Labels
                    </p>
                  </li>
                </Link>
                <Link href="/admin/manage-labels">
                  <li
                    className={`m-2 flex rounded-xl bg-[#ffffff] p-4 "
                      ? "border-gradient border-2"
                      : ""
                      }`}
                    style={{ width: "100%" }}
                  >
                    <p className="flex items-center gap-3 text-lg font-bold">
                      <FaCog /> Labels
                    </p>
                  </li>
                </Link>				</ul>

            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}