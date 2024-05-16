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
} from '@chakra-ui/react'
import Link from "next/link";
import { FaChevronRight, FaCog } from "react-icons/fa";
import LogoutButton from "./logout-button";
export default function DrawerLayout({ children }: { children: React.ReactNode }) {

	return (
		<>
			<HeaderNew />
			<main>{children}</main>
		</>
	);
}
function AdminNav() {
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
				<MenuItem><Link href="/admin/clinics">
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
				<MenuItem><Link href="/admin/pharmacies">
					<li
						className="m-2 flex rounded-xl bg-[#ffffff] p-4"
						style={{ width: "100%" }}
					>
						<p className="flex items-center gap-3 text-lg font-bold">
							<FaCog /> Pharmacies
						</p>
					</li>
				</Link></MenuItem>
				<MenuItem><Link href="/admin/doctors">
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
function UserNav() {
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
				<MenuItem><Link href="/admin/clinics">
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
				<MenuItem><Link href="/admin/pharmacies">
					<li
						className="m-2 flex rounded-xl bg-[#ffffff] p-4"
						style={{ width: "100%" }}
					>
						<p className="flex items-center gap-3 text-lg font-bold">
							<FaCog /> Pharmacies
						</p>
					</li>
				</Link></MenuItem>
				<MenuItem><Link href="/admin/doctors">
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
function HeaderNew() {
	return (
		<div className="navbar bg-base-100">
			<div className="navbar-start">
				<AdminNav />
			</div>
			<div className="navbar-center">
				<Link href="/" className="btn btn-ghost text-xl">Hospital CRM</Link>
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
							<Link href="/admin">Admin Panel</Link>
						</li>
					</ul>
				</div>

			</div>
		</div>
	)
}
function Header() {

	return (
		<div className="navbar bg-base-100">
			{/*<label
				htmlFor="my-drawer-2"
				className="btn btn-primary drawer-button lg:hidden"
			>
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
			</label>*/}
			<div className="flex-1">
				<a className="btn btn-ghost text-xl">Hospital CRM</a>
			</div>
			<Menu>
				<MenuButton as={Button} rightIcon={<FaChevronRight />}>
					Actions
				</MenuButton>
				<MenuList>
					<MenuItem>Download</MenuItem>
					<MenuItem>Create a Copy</MenuItem>
					<MenuItem>Mark as Draft</MenuItem>
					<MenuItem>Delete</MenuItem>
					<MenuItem>Attend a Workshop</MenuItem>
				</MenuList>
			</Menu>			<div className="flex-none gap-2">
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
							<Link href="/admin">Admin Panel</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
