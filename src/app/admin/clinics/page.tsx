"use client";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Skeleton, useToast } from "@chakra-ui/react";
import { Clinic, Clinicians } from "utils/used-types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loading from "~/app/loading";
export default function CliniciansView() {
	const callBackUrl = usePathname();
	const { data: session, status } = useSession();
	if (status === "unauthenticated") {
		void signIn(undefined, { callbackUrl: callBackUrl });
	}
	const toast = useToast();
	const [loading, setLoading] = useState(false);
	const [clinics, setClinics] = useState<Array<Clinic> | undefined>(undefined);

	const [isClient, setIsClient] = useState(false);
	useEffect(() => {

		setIsClient(true);
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
	if (status == "loading") {
		return (<Loading />)
	}

	if (!isClient) {
		return <Loading />;
	}
	console.log({ session });
	if (isClient && status == "authenticated") {
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
									<th>Location</th>
									<th>services</th>
								</tr>
							</thead>
							{clinics?.length != 0 ? (
								<tbody>
									{clinics?.map((clinic, index) => {
										return (
											<tr key={index}>
												<th>{index + 1}</th>
												<td>{clinic?.estname}</td>
												<td>{clinic?.phonenumber}</td>
												<td>{clinic?.location}</td>
												<td>
													{clinic?.services.map(
														(service: string, index: number) => {
															return <span key={index}>{service}, </span>;
														},
													)}
												</td>
											</tr>
										);
									})}
								</tbody>
							) : (
								<div className="flex w-screen items-center justify-center">
									<h1 className="text-xl">no clinics have signed up</h1>
								</div>)}
						</table>
					</div>
				</main>
			</Skeleton>
		)
	}
}
