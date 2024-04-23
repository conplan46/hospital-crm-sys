import Link from "next/link"
import { useRouter } from "next/router"
import { FaCog } from "react-icons/fa"

export const Layout = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	return (<>
		<div className="navbar bg-base-100">
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
							<a className="justify-between">
								Profile
								<span className="badge">New</span>
							</a>
						</li>
						<li><a>Settings</a></li>
						<li><a>Logout</a></li>
					</ul>
				</div>
			</div>
		</div>
		<div className="drawer lg:drawer-open">
			<input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col items-center justify-center">
				{/* Page content here */}
				<main className="m-2">{children}</main>
				<label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>

			</div>
			<div className="drawer-side">
				<label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
				<ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
					{/* Sidebar content here */}
					<Link href="/admin/manage-labels">
						<li
							className={`m-2 mb-16 flex rounded-xl bg-[#ffffff] p-4 ${router.pathname === "/admin/manage-labels"
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
							className={`m-2  flex rounded-xl bg-[#ffffff] p-4 ${router.pathname === "/admin/manage-labels"
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
							className={`m-2 flex rounded-xl bg-[#ffffff] p-4 ${router.pathname === "/admin/manage-labels"
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
	</>
	)
}
