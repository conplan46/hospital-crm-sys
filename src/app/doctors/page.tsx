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
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type Clinician, type Doctor } from "utils/used-types";
import Loading from "../loading";
import placeholder from "../../../public/98691529-default-placeholder-doctor-half-length-portrait-photo-avatar-gray-color.jpg";
import Image from "next/image";
import Booking from "~/components/booking";

export default function DoctorsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const toast = useToast();
  const doctorsQuery = useQuery({
    queryKey: ["doctors"],
    queryFn: async function () {
      try {
        const res = await fetch("/api/get-doctors");
        const data = (await res.json()) as {
          status: string;
          doctors: Array<Doctor>;
        };
        return data?.doctors;
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
  console.log({ doctorsQuery });

  if (!isClient) {
    return <Loading />;
  }
  if (isClient) {
    return (
      <Skeleton
        className="h-screen w-screen"
        isLoaded={doctorsQuery?.isFetched}
      >
        {doctorsQuery?.data?.length ?? new Array<Clinician>().length > 0 ? (
          <Heading size="mb" m={6}>
            Registered Doctors
          </Heading>
        ) : (
          <Heading size="mb" m={6}>
            No Doctors to show
          </Heading>
        )}
        <Wrap>
          {doctorsQuery?.data?.map((doctor, index) => {
            return (
              <>
                <WrapItem>
                  <DoctorsComponent
                    key={index}
                    handler={doctor?.id}
                    name={`${doctor?.firstname} ${doctor?.lastname}`}
                    areaOfSpeciality={doctor?.primaryareaofspeciality}
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
function DoctorsComponent({
  name,
  areaOfSpeciality,
  handler,
}: {
  handler: number | undefined;
  name: string;
  areaOfSpeciality: string;
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Booking
        role="doctors"
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

            <Text py="2">Primary Area of Speciality</Text>
            <UnorderedList>
              <ListItem>{areaOfSpeciality}</ListItem>;
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
