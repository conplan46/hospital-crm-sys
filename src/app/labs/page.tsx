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
import type { Lab, labsDataType } from "utils/used-types";
import Loading from "../loading";
import placeholder from "../../../public/depositphotos_510753268-stock-illustration-hospital-web-icon-simple-illustration.jpg";
import Booking from "~/components/booking";
import { Prisma } from "@prisma/client";
export default function LabsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const toast = useToast();
  const labsQuery = useQuery({
    queryKey: ["labs"],
    queryFn: async function () {
      try {
        const res = await fetch("/api/get-verified-labs");
        const data = (await res.json()) as {
          status: string;
          labs: Array<labsDataType>;
        };
        return data?.labs;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching the labs",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });
  console.log({ labsQuery });

  if (!isClient) {
    return <Loading />;
  }
  if (isClient) {
    return (
      <Skeleton className="h-screen w-screen" isLoaded={labsQuery?.isFetched}>
        {labsQuery?.data?.length ?? new Array<Lab>().length > 0 ? (
          <Heading size="mb" m={6}>
            Registered Labs
          </Heading>
        ) : (
          <Heading size="mb" m={6}>
            No Labs to show
          </Heading>
        )}
        <Wrap>
          {labsQuery?.data?.map((lab, index) => {
            return (
              <WrapItem key={index}>
                <LabComponent
                  handler={lab.id}
                  name={lab.estname}
                  services={lab?.services as Prisma.JsonArray}
                />
              </WrapItem>
            );
          })}
        </Wrap>
      </Skeleton>
    );
  }
}
function LabComponent({
  name,
  services,
  handler,
}: {
  name: string;
  services: Prisma.JsonArray;
  handler: number | undefined;
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();
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
                onOpen();
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
