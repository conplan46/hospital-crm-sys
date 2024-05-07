import { Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import Head from "next/head"

import Link from "next/link"
import { FaClinicMedical } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import LogoutButton from "~/components/logout-button";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (<>
		<div className="navbar bg-base-100">
			<div className="flex-1">
				<a className="btn btn-ghost text-xl">Admin Panel</a>
			</div>
		</div>
	</>
	)
}

