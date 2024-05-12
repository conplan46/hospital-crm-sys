'use client'
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Skeleton, useToast } from "@chakra-ui/react";
import { Clinicians, Doctor } from "utils/used-types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loading from "~/app/loading";
export default function DoctorsView() {
	const callBackUrl = usePathname()
	const { data: session, status } = useSession();
	if (status === "unauthenticated") {
		void signIn(undefined, { callbackUrl: callBackUrl });
	}
	const toast = useToast();
	const [loading, setLoading] = useState(false)
	const [doctors, setDoctors] = useState<Array<Doctor> | undefined>(undefined)
	const [isClient, setIsClient] = useState(false)
	useEffect(() => {
		setIsClient(true)
		setLoading(true);
		fetch("/api/get-doctors", { headers: { 'Content-Type': 'application/json' }, method: "GET" }).then(data => data.json()).then((data: { status: string, doctors: Array<Doctor> }) => {
			setLoading(false);
			if (data?.status === 'success') {
				setDoctors(data?.doctors)
			} else {
				toast({ status: "error", description: "An error occured fetching clinicians" });
			}
		}
		).catch(err => console.error(err))
	}, [])
	console.log({ session })

	if (status == "loading") {
		return (<Loading />)
	}

	if (isClient && status == "authenticated") {
		return (
			<Skeleton isLoaded={!loading}>
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th></th>
								<th>Name</th>
								<th>Phone Number</th>
								<th>Primary area of Speciality</th>
								<th>County of practice</th>
							</tr>
						</thead>
						<tbody>
							{doctors?.map((doctor, index) => {
								return (
									<tr key={index}>
										<th>{index + 1}</th>
										<td>{`${doctor?.firstname} ${doctor?.lastname}`}</td>
										<td>{doctor?.phonenumber}</td>
										<td>{doctor?.primaryareaofspeciality}</td>
										<td>{doctor?.countyofpractice}</td>
									</tr>

								)
							})}
						</tbody>
						<tfoot>
							<tr>
								<th></th>
								<th>Name</th>
								<th>Phone Number</th>
								<th>Primary area of Speciality</th>
								<th>County of practice</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</Skeleton>
		)
	}
}
