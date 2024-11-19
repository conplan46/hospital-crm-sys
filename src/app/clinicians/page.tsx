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

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Star, Clock, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type Clinician } from "utils/used-types";
import Loading from "../loading";
import placeholder from "../../../public/98691529-default-placeholder-doctor-half-length-portrait-photo-avatar-gray-color.jpg";
import Image from "next/image";
import Booking from "~/components/booking";
import { useAtomValue } from "jotai";
import { userDataAtom } from "~/components/drawer";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { clinicians, users } from "drizzle/schema";

export default function CliniciansPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const toast = useToast();
  const cliniciansQuery = useQuery({
    queryKey: ["clinics"],
    queryFn: async function () {
      try {
        const res = await fetch("/api/get-verified-clinicians");
        const data = (await res.json()) as {
          clinicians: Array<{
            clinicians: typeof clinicians.$inferSelect;
            users: typeof users.$inferSelect;
          }>;
        };
        return data?.clinicians;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching the Clinicians",
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
        {cliniciansQuery?.data?.length ??
        new Array<{
          clincians: typeof clinicians.$inferSelect;
          users: typeof users.$inferSelect;
        }>().length > 0 ? (
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
            return (
              <>
                <WrapItem>
                  <ClinicianComponent
                    key={index}
                    handler={clinician?.clinicians?.id}
                    name={`${clinician?.clinicians?.firstname} ${clinician?.clinicians?.lastname}`}
                    areaOfSpeciality={
                      clinician?.clinicians?.primaryareaofspeciality
                    }
                    rating={0}
                    location={clinician?.clinicians?.countyofpractice}
                    description={`Experienced health practitioner. Specializes in ${clinician?.clinicians?.primaryareaofspeciality}`}
                    availability="available"
                    clinicianId={clinician?.clinicians?.id}
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
function ClinicianComponent({
  name,
  areaOfSpeciality,
  handler,
  rating,
  description,
  location,
  availability,
  clinicianId,
}: {
  name: string;
  areaOfSpeciality: string;
  handler: number | undefined;
  rating: number;
  description: string;
  availability: string;
  location: string;
  clinicianId: number;
}) {
  const pathName = usePathname();
  const toast = useToast();
  const { data: session, status } = useSession();
  const userDataAtomI = useAtomValue(userDataAtom);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const isClinicianVerified = useQuery({
    queryKey: ["is-clinician-verified"],
    queryFn: async () => {
      const formData = new FormData();
      formData.append("id", `${clinicianId}`);
      const res = await fetch("/api/is-clinician-verified", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { verified: boolean };
      console.log({ isVerified: data.verified });
      return data;
    },
  });
  if (isClinicianVerified?.data?.verified) {
    return (
      <>
        <Booking
          role="clinician"
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          handler={handler}
        />
        <Card className="m-1 mx-auto w-full max-w-md">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={name} alt={name} />
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
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
    );
  }
}
