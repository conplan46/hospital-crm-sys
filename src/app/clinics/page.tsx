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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Clinic, clinicsDataType } from "utils/used-types";
import Loading from "../loading";
import placeholder from "../../../public/depositphotos_510753268-stock-illustration-hospital-web-icon-simple-illustration.jpg";
import Booking from "~/components/booking";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";
import { userDataAtom } from "~/components/drawer";
import { Prisma } from "@prisma/client";
export default function ClinicsPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const toast = useToast();
  const clinicsQuery = useQuery({
    queryKey: ["clinics"],
    queryFn: async function () {
      try {
        const res = await fetch("/api/get-verified-clinics");
        const data = (await res.json()) as {
          status: string;
          clinics: Array<clinicsDataType>;
        };
        return data?.clinics;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching verified clinics",
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
        {clinicsQuery?.data ?? new Array<clinicsDataType>().length > 0 ? (
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
                  handler={clinic.id}
                  name={clinic.estname}
                  services={clinic?.services as Prisma.JsonArray}
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
  handler,
}: {
  name: string;
  services: Prisma.JsonArray;

  handler: number | undefined;
}) {
  const toast = useToast();
  const userDataAtomI = useAtomValue(userDataAtom);
  const { data: session, status } = useSession();
  const pathName = usePathname();
  const { isOpen, onClose, onOpen } = useDisclosure();
  console.log({ role: userDataAtomI?.userrole });
  return (
    <>
      <Booking
        role="clinic"
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        handler={handler}
      />
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
                return <ListItem key={index}>{service?.toString()}</ListItem>;
              })}
            </UnorderedList>
          </CardBody>

          <CardFooter>
            <Button
              onClick={() => {
                if (userDataAtomI?.userrole !== "patient") {
                  toast({
                    description: "You account is not a patient account",
                    status: "error",
                  });
                } else {
                  if (status === "unauthenticated") {
                    void signIn(undefined, { callbackUrl: pathName });
                  }
                  if (status === "authenticated") {
                    onOpen();
                  }
                }
              }}
              variant="solid"
              colorScheme="blue"
            >
              Book services
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </>
  );
}
