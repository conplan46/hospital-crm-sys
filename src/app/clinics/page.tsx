"use client";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Heading,
	ListItem,
	Skeleton,
	Stack,
	Text,
	UnorderedList,
	Wrap,
	WrapItem,
	useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Clinic } from "utils/used-types";
import Loading from "../loading";
import placeholder from "../../../public/depositphotos_510753268-stock-illustration-hospital-web-icon-simple-illustration.jpg";
export default function ClinicsPage() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);
	const toast = useToast();
	const clinicsQuery = useQuery({
		queryKey: ["clinics"],
		queryFn: async function() {
			try {
				const res = await fetch("/api/get-clinics");
				const data = (await res.json()) as {
					status: string;
					clinics: Array<Clinic>;
				};
				return data?.clinics;
			} catch (e) {
				console.error(e);
				toast({
					description: "An error occured fetching the inventory",
					status: "error",
					duration: 9000,
					isClosable: true,
				});
			}
		},
	});
	console.log({ clinicsQuery });

	if (!isClient) {
		return <Loading />;
	}
	if (isClient) {
		return (
			<Skeleton
				className="h-screen w-screen"
				isLoaded={clinicsQuery?.isFetched}
			>
				{clinicsQuery?.data?.length ?? new Array<Clinic>().length > 0 ? (
					<Heading size="mb" m={6}>
						Registered Clinics
					</Heading>
				) : (
					<Heading size="mb" m={6}>
						No Clinics to show
					</Heading>
				)}
				<Wrap>
					{clinicsQuery?.data?.map((clinic, index) => {
						return (
							<WrapItem key={index}>
								<ClinicComponent
									name={clinic.estname}
									services={clinic.services}
								/>
							</WrapItem>
						);
					})}
				</Wrap>
			</Skeleton>
		);
	}
}
function ClinicComponent({
	name,
	services,
}: {
	name: string;
	services: Array<string>;
}) {
	return (
		<Card
			direction={{ base: "column", sm: "row" }}
			overflow="hidden"
			variant="outline"
		>
			<Image
				height={200}
				width={200}
				//maxW={{ base: "100%", sm: "200px" }}
				src={placeholder}
				alt="placeholder"
			/>{" "}
			<Stack>
				<CardBody>
					<Heading size="md">{name}</Heading>

					<Text py="2">services</Text>
					<UnorderedList>
						{services.map((service, index) => {
							return <ListItem key={index}>{service}</ListItem>;
						})}
					</UnorderedList>
				</CardBody>

				<CardFooter>
					<Button variant="solid" colorScheme="blue">
						Book services
					</Button>
				</CardFooter>
			</Stack>
		</Card>
	);
}