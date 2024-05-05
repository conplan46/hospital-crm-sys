'use client'

import { signOut } from "next-auth/react"

export default function LogoutButton() {
	return (
		<li><a onClick={() => { void signOut() }}>Logout</a></li>

	)
}
