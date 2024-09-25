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
import {
  Booking,
  Clinic,
  Clinician,
  Doctor,
  Patient,
  Pharmacy,
  User,
  UserDataDrizzle,
  type UserData,
  type UserDataAl,
} from "utils/used-types";
import Loading from "../loading";
import { useQuery } from "@tanstack/react-query";
import { bookings, patients } from "drizzle/schema";
import PatientVitals from "~/components/patients-vitals";
export default function ProfilePage() {
  const callBackUrl = usePathname();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: callBackUrl });
  }
  const [isClient, setIsClient] = useState(false);
  const userDataQuery = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const res = await fetch("/api/get-user-data", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
        method: "POST",
      });
      /* :{ status: string; data: UserData } */
      const data = (await res.json()) as {
        status: string;
        data: UserDataDrizzle;
      };
      console.log(data);
      return data?.data;
    },
  });
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
  const isAdminQuery = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const res = await fetch("/api/is-admin", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
        method: "POST",
      });
      /* :{ status: string; data: UserData } */
      const data = (await res.json()) as { status: string; isAdmin: boolean };
      console.log(data);
      return data.isAdmin;
    },
  });
  console.log({ isAdminQuery });
  console.log({ userDataQuery });
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
        return `${userDataQuery?.data?.[0]?.doctors?.firstname} ${userDataQuery?.data?.[0]?.doctors?.lastname}`;
      case "patient":
        return userDataQuery?.data?.[0]?.patients?.name;

      case "clinician":
        return `${userDataQuery?.data?.[0]?.clinicians?.firstname} ${userDataQuery?.data?.[0]?.clinicians?.lastname}`;
    }
  }
  if (isClient && status == "authenticated") {
    return (
      <Skeleton
        className="h-screen w-screen"
        isLoaded={
          userDataQuery.isFetched &&
          isAdminQuery?.isFetched &&
          bookingsQuery?.isFetched
        }
      >
        <div className="flex flex-row items-baseline">
          <div className="avatar placeholder m-2">
            <div className="w-24 rounded-full bg-neutral text-neutral-content">
              <span className="text-3xl">D</span>
            </div>
          </div>
          <div className="m-2 flex flex-col">
            {userDataQuery?.data?.[0]?.users?.userrole === "patient" ? (
              <span className="text-3xl">
                {userDataQuery?.data?.[0]?.patients?.name}
              </span>
            ) : (
              <span className="text-3xl">
                {userDataQuery?.data?.[0]?.users?.userrole == "pharmacy" ||
                userDataQuery?.data?.[0]?.users?.userrole == "clinic"
                  ? userDataQuery?.data?.[0]?.pharmacy?.estname ??
                    userDataQuery?.data?.[0]?.clinics?.estname
                  : name(userDataQuery?.data?.[0]?.users?.userrole ?? "")}
              </span>
            )}
            <span className="mt-2">
              {userDataQuery?.data?.[0]?.users.userrole}
            </span>{" "}
          </div>
        </div>
        <div>
          <Wrap>
            {userDataQuery?.data?.[0]?.users?.userrole == "pharmacy" ||
            userDataQuery?.data?.[0]?.users?.userrole == "clinic" ? (
              <WrapItem>
                <Stat className="m-3 rounded-md border-2 p-2">
                  <StatLabel>Establishment Name</StatLabel>
                  <StatNumber>
                    {userDataQuery?.data?.[0]?.pharmacy?.estname ??
                      userDataQuery?.data?.[0]?.clinics?.estname}
                  </StatNumber>
                </Stat>
              </WrapItem>
            ) : (
              <>
                {userDataQuery?.data?.[0]?.users?.userrole === "patient" ? (
                  <WrapItem>
                    <Stat className="m-3 rounded-md border-2 p-2">
                      <StatLabel>Name</StatLabel>
                      <StatNumber>
                        {name(userDataQuery?.data?.[0]?.users?.userrole ?? "")}
                      </StatNumber>
                    </Stat>
                  </WrapItem>
                ) : (
                  <WrapItem>
                    <Stat className="m-3 rounded-md border-2 p-2">
                      <StatLabel>First Name</StatLabel>
                      <StatNumber>
                        {userDataQuery?.data?.[0]?.doctors?.firstname ??
                          userDataQuery?.data?.[0]?.clinicians?.firstname}
                      </StatNumber>
                    </Stat>
                  </WrapItem>
                )}
                {userDataQuery?.data?.[0]?.users?.userrole === "patient" ? (
                  ""
                ) : (
                  <WrapItem>
                    <Stat className="m-3 rounded-md border-2 p-2">
                      <StatLabel>Last Name</StatLabel>
                      <StatNumber>
                        {userDataQuery?.data?.[0]?.doctors?.firstname ??
                          userDataQuery?.data?.[0]?.clinicians?.firstname}
                      </StatNumber>
                    </Stat>
                  </WrapItem>
                )}
              </>
            )}
          </Wrap>

          <Stat className="m-3 rounded-md border-2 p-2">
            <StatLabel>Phone Number</StatLabel>
            <StatNumber>
              {userDataQuery?.data?.[0]?.pharmacy?.phonenumber ??
                userDataQuery?.data?.[0]?.clinicians?.phonenumber ??
                userDataQuery?.data?.[0]?.clinics?.phonenumber ??
                userDataQuery?.data?.[0]?.doctors?.phonenumber ??
                userDataQuery?.data?.[0]?.patients?.phonenumber}
            </StatNumber>
          </Stat>
          {userDataQuery?.data?.[0]?.users?.userrole == "doctor" ||
          userDataQuery?.data?.[0]?.users?.userrole == "clinician" ? (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Primary Area of Speciality</StatLabel>
              <StatNumber>
                {userDataQuery?.data?.[0]?.doctors?.primaryareaofspeciality ??
                  userDataQuery?.data?.[0]?.clinicians?.primaryareaofspeciality}
              </StatNumber>
            </Stat>
          ) : (
            ""
          )}

          {userDataQuery?.data?.[0]?.users?.userrole == "pharmacy" ||
          userDataQuery?.data?.[0]?.users?.userrole == "clinic" ? (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Location</StatLabel>
              <StatNumber>
                {userDataQuery?.data?.[0]?.pharmacy?.location ??
                  userDataQuery?.data?.[0]?.clinics?.location}
              </StatNumber>
            </Stat>
          ) : userDataQuery?.data?.[0]?.users?.userrole === "patient" ? (
            ""
          ) : (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>County of Practice</StatLabel>
              <StatNumber>
                {userDataQuery?.data?.[0]?.doctors?.countyofpractice ??
                  userDataQuery?.data?.[0]?.clinicians?.countyofpractice}
              </StatNumber>
            </Stat>
          )}
          {userDataQuery?.data?.[0]?.users?.userrole == "pharmacy" ||
          userDataQuery?.data?.[0]?.users?.userrole == "clinic" ? (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Name</StatLabel>
              <StatNumber>
                {userDataQuery?.data?.[0]?.pharmacy?.estname ??
                  userDataQuery?.data?.[0]?.clinics?.estname}
              </StatNumber>
            </Stat>
          ) : (
            ""
          )}
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
