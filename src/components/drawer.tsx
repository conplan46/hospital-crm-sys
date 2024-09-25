"use client";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaChevronRight, FaCog } from "react-icons/fa";
import LogoutButton from "./logout-button";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UserDataAl } from "utils/used-types";

import { UserDataDrizzle } from "utils/used-types";
import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
export const userDataAtom = atom<UserDataDrizzle | undefined>(undefined);
export default function DrawerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const userDataAtomI = useAtom(userDataAtom);
  const setUserData = useSetAtom(userDataAtom);
  const { data: session, status } = useSession();
  const path = usePathname();
  const userDataQuery = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const res = await fetch("/api/get-user-data", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
        method: "POST",
      });
      /* :{ status: string; data: UserData } */
      const data = (await res.json()) as {
        status: string;
        data: UserDataDrizzle;
      };
      console.log(data);
      if (data.data) {
        setUserData(data?.data);
        return data?.data;
      }
    },
  });

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
      console.log({data});
      return data.isAdmin;
    },
  });
  //console.log(userDataQuery.data)
  if (isClient) {
    return (
      <>
        <HeaderNew
          isAdmin={isAdminQuery.data ?? false}
          id={userDataQuery?.data?.[0]?.users?.id}
          role={userDataQuery?.data?.[0]?.users?.userrole ?? ""}
        />
        <main>{children}</main>
      </>
    );
  }
}
function AdminNav({ role }: { role: string | undefined }) {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<FaChevronRight />}>
        Resources
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Link href="/admin/clinicians">
            <li
              className="m-2 flex rounded-xl bg-[#ffffff] p-4"
              style={{ width: "100%" }}
            >
              <p className="flex items-center gap-3 text-lg font-bold">
                <FaCog /> Clinicians
              </p>
            </li>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/admin">
            <li
              className="m-2 flex rounded-xl bg-[#ffffff] p-4"
              style={{ width: "100%" }}
            >
              <p className="flex items-center gap-3 text-lg font-bold">
                <FaCog /> Admin
              </p>
            </li>
          </Link>
        </MenuItem>

        <MenuItem>
          <Link href="/admin/clinics">
            <li
              className="m-2 flex rounded-xl bg-[#ffffff] p-4"
              style={{ width: "100%" }}
            >
              <p className="flex items-center gap-3 text-lg font-bold">
                <FaCog /> Clinics
              </p>
            </li>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/admin/pharmacies">
            <li
              className="m-2 flex rounded-xl bg-[#ffffff] p-4"
              style={{ width: "100%" }}
            >
              <p className="flex items-center gap-3 text-lg font-bold">
                <FaCog /> Pharmacies
              </p>
            </li>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/admin/doctors">
            <li
              className="m-2 flex rounded-xl bg-[#ffffff] p-4"
              style={{ width: "100%" }}
            >
              <p className="flex items-center gap-3 text-lg font-bold">
                <FaCog /> Doctors
              </p>
            </li>
          </Link>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
function UserNav({ role }: { role: string | undefined }) {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<FaChevronRight />}>
        Resources
      </MenuButton>
      <MenuList>
        <MenuItem></MenuItem>
        <MenuItem>
          <Link href="/clinics">
            <li
              className="m-2 flex rounded-xl bg-[#ffffff] p-4"
              style={{ width: "100%" }}
            >
              <p className="flex items-center gap-3 text-lg font-bold">
                <FaCog /> Clinics
              </p>
            </li>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/pharmacies">
            <li
              className="m-2 flex rounded-xl bg-[#ffffff] p-4"
              style={{ width: "100%" }}
            >
              <p className="flex items-center gap-3 text-lg font-bold">
                <FaCog /> Pharmacies
              </p>
            </li>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/labs">
            <li
              className="m-2 flex rounded-xl bg-[#ffffff] p-4"
              style={{ width: "100%" }}
            >
              <p className="flex items-center gap-3 text-lg font-bold">
                <FaCog /> Labs
              </p>
            </li>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/clinicians">
            <li
              className="m-2 flex rounded-xl bg-[#ffffff] p-4"
              style={{ width: "100%" }}
            >
              <p className="flex items-center gap-3 text-lg font-bold">
                <FaCog /> Clinicians
              </p>
            </li>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/doctors">
            <li
              className="m-2 flex rounded-xl bg-[#ffffff] p-4"
              style={{ width: "100%" }}
            >
              <p className="flex items-center gap-3 text-lg font-bold">
                <FaCog /> Doctors
              </p>
            </li>
          </Link>
        </MenuItem>

        <MenuItem>
          <Link href="/pharm-db">
            <li
              className="m-2 flex rounded-xl bg-[#ffffff] p-4"
              style={{ width: "100%" }}
            >
              <p className="flex items-center gap-3 text-lg font-bold">
                <FaCog /> Pharmaceutical Database
              </p>
            </li>
          </Link>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
function HeaderNew({
  role,
  id,
  isAdmin,
}: {
  role: string | undefined;
  id: number | undefined;
  isAdmin: boolean;
}) {
  const urlObj = constructUrl(role, id);
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        {isAdmin ? <AdminNav role={role} /> : <UserNav role={role} />}
      </div>
      <div className="navbar-center">
        <Link href="/" className="btn btn-ghost text-xl">
          Hospital CRM
        </Link>
      </div>
      <div className="navbar-end">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="avatar placeholder btn btn-circle btn-ghost"
          >
            <div className="w-10  rounded-full">
              <span className="text-3xl">D</span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <Link href="/profile" className="justify-between">
                Profile
              </Link>
            </li>
            <LogoutButton />
            <li>
              <Link href={{ pathname: urlObj?.href }}>{urlObj?.linkText}</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
function constructUrl(role: string | undefined, id: number | undefined) {
  switch (role) {
    case "pharmacy":
      if (id) {
        return { href: `/pharmacy-dash/${id}`, linkText: "Pharmacy Dashboard" };
      }
      return { href: `#`, linkText: "Pharmacy Dashboard" };

    case "clinic":
      if (id) {
        return { href: `/clinic/${id}`, linkText: "Clinic Dashboard" };
      }
      return { href: `#`, linkText: "Clinic Dashboard" };
  }
}
