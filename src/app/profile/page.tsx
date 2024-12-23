"use client";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  StackDivider,
  Stat,
  Text,
  StatLabel,
  StatNumber,
  Wrap,
  WrapItem,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card as CardShd,
  CardContent as CardContentShd,
  CardDescription as CardDescriptionShd,
  CardFooter as CardFooterShd,
  CardHeader as CardHeaderShd,
  CardTitle as CardTitleShd,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Briefcase, MapPin, Phone, Star, User as UserIcon } from "lucide-react";
import { Booking } from "utils/used-types";
import Loading from "../loading";
import { useQuery } from "@tanstack/react-query";
import {
  bookings,
  clinicians,
  clinics,
  doctors,
  nurse,
  patients,
  pharmacy,
  users,
} from "drizzle/schema";
import PatientVitals from "~/components/patients-vitals";
import { useAtom } from "jotai";
import { userDataAtom } from "~/components/drawer";
export default function ProfilePage() {
  const [userData, _] = useAtom(userDataAtom);
  const callBackUrl = usePathname();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: callBackUrl });
  }
  console.log({ userData });
  const [isClient, setIsClient] = useState(false);
  //const userDataQuery = useQuery({
  //  queryKey: ["user-data"],
  //  queryFn: async () => {
  //    const formData = new FormData();
  //    formData.append("email", session?.user?.email ?? "");
  //    const res = await fetch("/api/get-user-data", {
  //      headers: { "Content-Type": "application/json" },
  //      body: JSON.stringify({ email: session?.user?.email }),
  //      method: "POST",
  //    });
  //    /* :{ status: string; data: UserData } */
  //    const data = (await res.json()) as {
  //      status: string;
  //      data: Array<{
  //        users?: typeof users.$inferSelect;
  //        clinics?: typeof clinics.$inferSelect;
  //        clinicians?: typeof clinicians.$inferSelect;
  //        doctors?: typeof doctors.$inferSelect;
  //        pharmacy?: typeof pharmacy.$inferSelect;
  //        patients?: typeof patients.$inferSelect;
  //        nurse?: typeof nurse.$inferSelect;
  //      }>;
  //    };
  //    console.log({ userData: data });
  //    return data?.data;
  //  },
  //});
  const bookingsQuery = useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/get-user-bookings", {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });
      /* :{ status: string; data: UserData } */
      const data = (await res.json()) as {
        status: string;
        bookings: Array<{
          bookings: typeof bookings.$inferSelect;
          patients: typeof patients.$inferSelect;
        }>;
      };
      console.log(data);
      return data.bookings;
    },
  });
  console.log({ bookingsQuery });
  //const isAdminQuery = useQuery({
  //  queryKey: ["isAdmin"],
  //  queryFn: async () => {
  //    const res = await fetch("/api/is-admin", {
  //      headers: { "Content-Type": "application/json" },
  //      body: JSON.stringify({ email: session?.user?.email }),
  //      method: "POST",
  //    });
  //    /* :{ status: string; data: UserData } */
  //    const data = (await res.json()) as { status: string; isAdmin: boolean };
  //    console.log(data);
  //    return data.isAdmin;
  //  },
  //});
  //console.log({ isAdminQuery });
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (status == "loading") {
    return <Loading />;
  }
  if (!isClient) {
    return <Loading />;
  }
  function name(role: string) {
    switch (role) {
      case "doctor":
        return `${userData?.doctors?.firstname} ${userData?.doctors?.lastname}`;
      case "patient":
        return userData?.patients?.name;

      case "clinician":
        return `${userData?.clinicians?.firstname} ${userData?.clinicians?.lastname}`;
    }
  }
  if (isClient && status == "authenticated") {
    return (
      <Skeleton
        className="h-screen w-screen"
        isLoaded={bookingsQuery?.isFetched}
      >
        <div>
          <CardShd className="m-2 w-full max-w-3xl">
            <CardHeaderShd className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Avatar className="h-24 w-24">
                <AvatarImage alt={name(userData?.userrole ?? "")} src={""} />
                <AvatarFallback>
                  {name(userData?.userrole ?? "")
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center sm:text-left">
                <CardTitleShd className="text-2xl font-bold">
                  {name(userData?.userrole ?? "")}
                </CardTitleShd>
                <CardDescriptionShd className="text-md">
                  {userData?.userrole}
                </CardDescriptionShd>
              </div>
            </CardHeaderShd>
            <CardContentShd className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={
                        userData?.pharmacy?.phonenumber ??
                        userData?.clinicians?.phonenumber ??
                        userData?.clinics?.phonenumber ??
                        userData?.doctors?.phonenumber ??
                        userData?.patients?.phonenumber ??
                        userData?.nurse?.phonenumber
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Primary Area of Specialty</Label>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="specialty"
                      value={
                        userData?.doctors?.primaryareaofspeciality ??
                        userData?.clinicians?.primaryareaofspeciality
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="county">County of Practice</Label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="county"
                      value={
                        userData?.pharmacy?.location ??
                        userData?.clinics?.location ??
                        userData?.doctors?.countyofpractice ??
                        userData?.nurse?.countyofpractice ??
                        userData?.clinicians?.countyofpractice
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">Practice License Number</Label>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="license"
                      value={
                        `${userData?.nurse?.practice_license_number}` ??
                        `${userData?.clinicians?.practiceLicenseNumber}` ??
                        `${userData?.doctors?.practice_license_number}` ??
                        `${userData?.clinics?.practice_license_number}` ??
                        `${userData?.pharmacy?.license_number}`
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </CardContentShd>
            <CardFooterShd className="flex justify-between"></CardFooterShd>
          </CardShd>
          <div className="m-3">
            {bookingsQuery?.data?.length ?? new Array<Booking>().length > 0 ? (
              <Heading size="mb" m={6}>
                Bookings
              </Heading>
            ) : (
              <Heading size="mb" m={6}>
                No Bookings to show
              </Heading>
            )}
            {(
              bookingsQuery?.data ??
              new Array<{
                bookings: typeof bookings.$inferSelect;
                patients: typeof patients.$inferSelect;
              }>()
            ).map((booking, index) => {
              return (
                <BookingEntryComponent
                  patient={booking.patients}
                  key={index}
                  name={booking?.patients.name}
                  index={index + 1}
                  mobileNumber={booking?.patients?.phonenumber}
                />
              );
            })}
          </div>
        </div>
      </Skeleton>
    );
  }
}
function BookingEntryComponent({
  name,
  mobileNumber,
  index,
  patient,
}: {
  name: string;
  mobileNumber: string;
  index: number;
  patient: typeof patients.$inferSelect;
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Card>
      <CardHeader className="flex items-baseline">
        <Heading className="mx-6" size="md">
          Booking {index}
        </Heading>
        <Button className="mx-6" onClick={onOpen}>
          Vitals
        </Button>
      </CardHeader>
      <PatientVitals
        onOpen={onOpen}
        isOpen={isOpen}
        onClose={onClose}
        patientId={patient.id}
      />
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Name
            </Heading>
            <Text pt="2" fontSize="sm">
              {name}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              MobileNumber
            </Heading>
            <Text pt="2" fontSize="sm">
              {mobileNumber}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}
