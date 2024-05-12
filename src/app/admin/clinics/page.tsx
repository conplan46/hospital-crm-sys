"use client";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Skeleton, useToast } from "@chakra-ui/react";
import { Clinic, Clinicians } from "utils/used-types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
export default function CliniciansView() {
	const callBackUrl = usePathname();
	const { data: session, status } = useSession();
	if (status === "unauthenticated") {
		void signIn(undefined, { callbackUrl: callBackUrl });
	}
	const toast = useToast();
	const [loading, setLoading] = useState(false);
	const [clinics, setClinics] = useState<Array<Clinic> | undefined>(
		undefined,
	);
	useEffect(() => {
		setLoading(true);
		fetch("/api/get-clinics", {
			headers: { "Content-Type": "application/json" },
			method: "GET",
		})
			.then((data) => data.json())
			.then((data: { status: string; clinics: Array<Clinic> }) => {
				setLoading(false);
				if (data?.status === "success") {
					setClinics(data?.clinics);
				} else {
					toast({
						status: "error",
						description: "An error occured fetching clinics",
					});
				}
			})
			.catch((err) => {
				toast({
					status: "error",
					description: "An error occured fetching clinics",
				});
				console.error(err);
			});
	}, []);
	console.log({ session });
	return (
		<Skeleton isLoaded={!loading}>
			<main className="w-full">
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
							{clinics?.map((clinic, index) => {
								return (
									<tr key={index}>
										<th>{index + 1}</th>
										<td>{clinic?.estname}</td>
										<td>{clinic?.phonenumber}</td>
										<td>{clinic?.location}</td>
										<td>{(JSON.parse(clinic?.services) as Array<string>).map((service: string, index: number) => {
											return (<span key={index}>{service}</span>)
										})}</td>
									</tr>
								);
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
			</main>
		</Skeleton>
	);
}
