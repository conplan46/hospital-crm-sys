"use client";

import {
	StatHelpText,
	StatArrow,
	StatGroup,
	Wrap,
	WrapItem,
	Skeleton,
	Center,
} from "@chakra-ui/react";
import {
	CircularProgress,
	CircularProgressLabel,
	Stat,
	StatLabel,
	StatNumber,
	useToast,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "../loading";

export default function HomePage() {
	const callBackUrl = usePathname();
	const { data: session, status } = useSession();
	if (status === "unauthenticated") {
		void signIn(undefined, { callbackUrl: callBackUrl });
	}
	const [isClient, setIsClient] = useState(false)
	const [demoStats, setDemoStats] = useState<{
		status: string;
		doctorCount: string;
		clinicsCount: string;
		clinicianCount: string;
		pharmaciesCount: string;
	}>();
	const toast = useToast();
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setIsClient(true)
		setLoading(true);
		fetch("/api/get-demographic-stats", {
			headers: { "Content-Type": "application/json" },
			method: "GET",
		})
			.then((data) => data.json())
			.then(
				(data: {
					status: string;
					doctorCount: string;
					clinicsCount: string;
					clinicianCount: string;
					pharmaciesCount: string;
				}) => {
					setDemoStats(data);
					console.log(data);
				},
			)
			.catch((err) => {
				toast({
					status: "error",
					description: "An error occured fetching data",
				});
				console.error(err);
			});
		setLoading(false);
	}, []);
	console.log({ session });
	if (status == "loading") {
		return (<Loading />)
	}
	if (status === "authenticated" && isClient) {
		return (
			<Suspense fallback={<Loading />}>
				<main className="p-4">
					<Skeleton isLoaded={!loading}>
						<Center className="flex flex-col">

							<h1 className="btn btn-ghost text-xl">Admin Dashboard</h1>
							<Wrap>
								<WrapItem>
									<Stat className="m-2 rounded-lg border-2 p-2">
										<StatLabel>Doctors</StatLabel>
										<StatNumber>{demoStats?.doctorCount}</StatNumber>
									</Stat>
								</WrapItem>

								<WrapItem>
									<Stat className="m-2 rounded-lg border-2 p-2">
										<StatLabel>Pharmacies</StatLabel>
										{" "}
										<StatNumber>{demoStats?.pharmaciesCount}</StatNumber>
									</Stat>
								</WrapItem>

								<WrapItem>
									<Stat className="m-2 rounded-lg border-2 p-2">
										<StatLabel>Clinics</StatLabel>
										{" "}
										<StatNumber>{demoStats?.clinicsCount}</StatNumber>
									</Stat>
								</WrapItem>

								<WrapItem>
									<Stat className="m-2 rounded-lg border-2 p-2">
										<StatLabel>Clinicians</StatLabel>
										{" "}
										<StatNumber>{demoStats?.clinicianCount}</StatNumber>
									</Stat>
								</WrapItem>
							</Wrap></Center>
						<Wrap className="flex items-center justify-center">
							<div className="border-grey mt-6 rounded-3xl border-x border-y bg-white p-6">
								<div className="m-2 flex justify-between">

									<h1 className="m-2 text-4xl default-font text-black">Manage Doctors</h1>
								</div>{" "}

								<Link
									target="_blank"
									href="/admin/doctors"
									className="btn default-font btn-outline ml-4 mt-4"
								>
									head in
								</Link>
							</div>
							<div className="border-grey mt-6 rounded-3xl border-x border-y bg-white p-6">
								<div className="m-2 flex justify-between">

									<h1 className="m-2 text-4xl default-font text-black">Manage Clinicians</h1>
								</div>{" "}

								<Link
									target="_blank"
									href="/admin/clinicians"
									className="btn default-font btn-outline ml-4 mt-4"
								>
									head in
								</Link>
							</div>
							<div className="border-grey mt-6 rounded-3xl border-x border-y bg-white p-6">
								<div className="m-2 flex justify-between">

									<h1 className="m-2 text-4xl default-font text-black">Manage Clinics</h1>
								</div>{" "}

								<Link
									target="_blank"
									href="/admin/clinics"
									className=" btn default-font btn-outline ml-4 mt-4"
								>
									head in
								</Link>
							</div>

							<div className="border-grey mt-6 rounded-3xl border-x border-y bg-white p-6">
								<div className="m-2 flex justify-between">

									<h1 className="m-2 text-4xl default-font text-black">Manage Pharmacies</h1>
								</div>{" "}

								<Link
									target="_blank"
									href="/admin/pharmacies"
									className="btn default-font btn-outline ml-4 mt-4"
								>
									head in
								</Link>
							</div>

						</Wrap>
					</Skeleton>
				</main></Suspense>
		)
	}
}
