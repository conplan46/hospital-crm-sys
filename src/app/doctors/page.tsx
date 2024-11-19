"use client";
import {
  Button,
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Star, Clock, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type Clinician, type Doctor } from "utils/used-types";
import Loading from "../loading";
import placeholder from "../../../public/98691529-default-placeholder-doctor-half-length-portrait-photo-avatar-gray-color.jpg";
import Image from "next/image";
import Booking from "~/components/booking";
import { usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useAtomValue } from "jotai";
import { userDataAtom } from "~/components/drawer";

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
                    rating={0}
                    location={doctor?.countyofpractice}
                    description={`Experienced health practitioner. Specializes in ${doctor?.primaryareaofspeciality}`}
                    availability="available"
                    doctorId={doctor?.id}
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

  rating,
  description,
  location,
  availability,

  doctorId,
}: {
  handler: number | undefined;
  name: string;
  areaOfSpeciality: string;
  doctorId: number;
  rating: number;
  description: string;
  availability: string;
  location: string;
}) {
  const pathName = usePathname();
  const toast = useToast();
  const { data: session, status } = useSession();
  const userDataAtomI = useAtomValue(userDataAtom);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const isDoctorVerified = useQuery({
    queryKey: ["is-doctor-verified"],
    queryFn: async () => {
      const formData = new FormData();
      formData.append("id", `${doctorId}`);
      const res = await fetch("/api/is-doctor-verified", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { verified: boolean };
      console.log({ isVerified: data.verified });
      return data;
    },
  });
  if(isDoctorVerified?.data?.verified){
  return (
    <>
      <Booking
        role="doctor"
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        handler={handler}
      />

      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={name} alt={name} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle>{name}</CardTitle>
            <CardDescription>{areaOfSpeciality}</CardDescription>
            <div className="mt-1 flex items-center">
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">{description}</p>
          <div className="flex flex-col gap-2">
            <Badge
              variant="secondary"
              className="flex w-fit items-center gap-1"
            >
              <Clock className="h-3 w-3" />
              <span className="text-xs">{availability}</span>
            </Badge>
            <Badge
              variant="secondary"
              className="flex w-fit items-center gap-1"
            >
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{location}</span>
            </Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => {
              if (userDataAtomI?.[0]?.users?.userrole !== "patient") {
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
          >
            Book Services
          </Button>
        </CardFooter>
      </Card>
    </>
  )}
}
