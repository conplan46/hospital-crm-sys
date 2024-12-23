"use client";

import { useAtom } from "jotai";
import { signOut } from "next-auth/react";
import { userDataAtom } from "./drawer";

export default function LogoutButton() {
  const [_, setUserData] = useAtom(userDataAtom);
  return (
    <li>
      <a
        onClick={() => {
          setUserData(undefined);
          void signOut();
        }}
      >
        Logout
      </a>
    </li>
  );
}
