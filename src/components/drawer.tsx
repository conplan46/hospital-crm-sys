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

import { Button as Buttonshad } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import { FaChevronRight, FaCog } from "react-icons/fa";
import LogoutButton from "./logout-button";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserDataAl } from "utils/used-types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Search, X } from "lucide-react";
import { UserDataDrizzle } from "utils/used-types";
import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { inventory, products } from "drizzle/schema";
import Image from "next/image";
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
      console.log({ data });
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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const searchMutation = useMutation({
    mutationKey: [`search-query`],
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("query", value);
      const res = await fetch("/api/search-products", {
        method: "POST",
        body: formData,
      });
      const searchResults = (await res.json()) as {
        results: Array<{
          products: typeof products.$inferSelect;
          inventory: typeof inventory.$inferSelect;
        }>;
      };
      console.log(searchResults);
      setOpen(true);
      return searchResults;
    },
  });
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const urlObj = constructUrl(role, id);
  useEffect(() => {
    if (value) {
    void  queryClient.cancelQueries({ queryKey: ["search-query"] });
      void searchMutation.mutateAsync();
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [value]);
  const handleClear = () => {
    setValue("");
    setOpen(false);
    inputRef.current?.focus();
  };
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">{<UserNav role={role} />}</div>
      <div className="navbar-center">
        <Link href="/" className="btn btn-ghost text-xl">
          Hospital CRM
        </Link>
      </div>
      <div className="navbar-end">
        <div className="mx-auto w-full max-w-sm">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  placeholder="Search products..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="pl-8 pr-8"
                />
                {value && (
                  <Buttonshad
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={handleClear}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Buttonshad>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-6" align="start">
              {searchMutation?.data?.results?.map((item) => (
                <Link key={item.inventory.productId} href={item.inventory.productUrl ?? ""}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative h-48 w-full flex-shrink-0 sm:h-auto sm:w-48">
                          <Image
                            src={item?.products?.imageUrl}
                            alt={item?.products?.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                          />
                        </div>
                        <div className="flex flex-grow flex-col justify-between p-4">
                          <div>
                            <h3 className="mb-2 text-lg font-semibold">
                              {item?.products?.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </PopoverContent>
          </Popover>
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

            {isAdmin ? (
              <li>
                <Link href="/admin" className="justify-between">
                  Admin Panel
                </Link>
              </li>
            ) : (
              ""
            )}
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
