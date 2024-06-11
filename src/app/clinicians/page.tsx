'use client'
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
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Clinic, Clinician, } from "utils/used-types";
import Loading from "../loading";
import placeholder from "../../../public/98691529-default-placeholder-doctor-half-length-portrait-photo-avatar-gray-color.jpg";
import Image from "next/image";

export default function CliniciansPage() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);
	const toast = useToast();
	const cliniciansQuery = useQuery({
		queryKey: ["clinics"],
		queryFn: async function() {
			try {
				const res = await fetch("/api/get-clinicians");
				const data = (await res.json()) as {
					status: string;
					clinicians: Array<Clinician>;
				};
				return data?.clinicians;
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
	console.log({ cliniciansQuery });

	if (!isClient) {
		return <Loading />;
	}
	if (isClient) {
		return (
			<Skeleton
				className="h-screen w-screen"
				isLoaded={cliniciansQuery?.isFetched}
			>
				{cliniciansQuery?.data?.length ?? new Array<Clinician>().length > 0 ? (
					<Heading size="mb" m={6}>
						Registered Clinicians
					</Heading>
				) : (
					<Heading size="mb" m={6}>
						No Clinicians to show
					</Heading>
				)}
				<Wrap>
					{cliniciansQuery?.data?.map((clinician, index) => {
						return (<>
							<WrapItem>
								<ClinicianComponent
									key={index}
									name={`${clinician.firstname} ${clinician.lastname}`}
									areaOfSpeciality={clinician.primaryareaofspeciality}
								/>
							</WrapItem>

						</>);
					})}</Wrap>
			</Skeleton>
		);
	}
}
function ClinicianComponent({
	name,
	areaOfSpeciality,
}: {
	name: string;
	areaOfSpeciality: string;
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

					<Text py="2">Primary Area of Speciality</Text>
					<UnorderedList>
						<ListItem>{areaOfSpeciality}</ListItem>;
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
