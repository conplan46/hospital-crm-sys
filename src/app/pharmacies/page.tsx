"use client";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Clinic, type Clinician, type Pharmacy } from "utils/used-types";
import Loading from "../loading";
import placeholder from "../../../public/depositphotos_510753268-stock-illustration-hospital-web-icon-simple-illustration.jpg";
import Image from "next/image";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function PharmacyPage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsClient(true);
  }, []);
  const toast = useToast();
  const pharmacyQuery = useQuery({
    queryKey: ["pharmacies"],
    queryFn: async function () {
      try {
        const res = await fetch("/api/get-verified-pharmacies");
        const data = (await res.json()) as {
          status: string;
          pharmacies: Array<Pharmacy>;
        };
        return data?.pharmacies;
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
  console.log({ pharmacyQuery });

  if (!isClient) {
    return <Loading />;
  }
  if (isClient) {
    return (
      <Skeleton
        className="h-screen w-screen"
        isLoaded={pharmacyQuery?.isFetched}
      >
        {pharmacyQuery?.data?.length ?? new Array<Pharmacy>().length > 0 ? (
          <Heading size="mb" m={6}>
            Registered Pharmacies
          </Heading>
        ) : (
          <Heading size="mb" m={6}>
            No Pharmacies to show
          </Heading>
        )}
        <Wrap>
          {pharmacyQuery?.data?.map((pharmacy, index) => {
            return (
              <>
                <WrapItem>
                  <PharmacyComponent
                    key={index}
                    router={router}
                    id={pharmacy?.id}
                    name={pharmacy?.estname}
                  />
                </WrapItem>
              </>
            );
          })}
        </Wrap>
      </Skeleton>
    );
  }
}
function PharmacyComponent({
  name,
  id,
  router,
}: {
  name: string;
  id: number;
  router: AppRouterInstance;
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

          <UnorderedList></UnorderedList>
        </CardBody>

        <CardFooter>
          <Button
            onClick={() => {
              void router.push(`/pharmacy/${id}`);
            }}
            variant="solid"
            colorScheme="blue"
          >
            View inventory
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  );
}
