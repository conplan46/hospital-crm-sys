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
		<div className="drawer lg:drawer-open">
			<input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex justify-center">
				{/* Page content here */}
				<main className="m-2">{children}</main>
				<label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>

			</div>
			<div className="drawer-side">
				<label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
				<ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
					{/* Sidebar content here */}
					<Link href="/admin/clinicians">
						<li
							className={`m-2 flex rounded-xl bg-[#ffffff] p-4"
								? "border-gradient border-2"
								: ""
								}`}
							style={{ width: "100%" }}
						>
							<p className="flex items-center gap-3 text-lg font-bold">
								<FaUserDoctor /> Clinicians
							</p>
						</li>
					</Link>
					<Link href="/admin/patients">
						<li
							className={`m-2  flex rounded-xl bg-[#ffffff] p-4"
								? "border-gradient border-2"
								: ""
								}`}
							style={{ width: "100%" }}
						>
							<p className="flex items-center gap-3 text-lg font-bold">
								<FaUserDoctor /> Patients
							</p>
						</li>
					</Link>
					<Link href="/admin/pharmacies">
						<li
							className={`m-2 flex rounded-xl bg-[#ffffff] p-4"
								? "border-gradient border-2"
								: ""
								}`}
							style={{ width: "100%" }}
						>
							<p className="flex items-center gap-3 text-lg font-bold">
								<FaClinicMedical /> Pharmacies
							</p>
						</li>
					</Link>				</ul>

			</div>
		</div>
	</>
	)
}

