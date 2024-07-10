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
  type UserData,
  type UserDataAl,
} from "utils/used-types";
import Loading from "../loading";
import { useQuery } from "@tanstack/react-query";
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
      const data = (await res.json()) as { status: string; data: UserDataAl };
      console.log(data);
      return data.data;
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
        bookings: Array<Booking>;
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
            <h1>profile</h1>
            <span className="text-3xl">
              {userDataQuery?.data?.userrole == "pharmacy" ||
              userDataQuery?.data?.userrole == "clinic"
                ? userDataQuery?.data?.estname
                : `${userDataQuery?.data?.firstname} ${userDataQuery?.data?.lastname}`}
            </span>
            <span className="mt-2">{userDataQuery?.data?.userrole}</span>{" "}
          </div>
        </div>
        <div>
          <Wrap>
            {userDataQuery?.data?.userrole == "pharmacy" ||
            userDataQuery?.data?.userrole == "clinic" ? (
              <WrapItem>
                <Stat className="m-3 rounded-md border-2 p-2">
                  <StatLabel>Establishment Name</StatLabel>
                  <StatNumber>{userDataQuery?.data?.estname}</StatNumber>
                </Stat>
              </WrapItem>
            ) : (
              <>
                <WrapItem>
                  <Stat className="m-3 rounded-md border-2 p-2">
                    <StatLabel>First Name</StatLabel>
                    <StatNumber>{userDataQuery?.data?.firstname}</StatNumber>
                  </Stat>
                </WrapItem>
                <WrapItem>
                  <Stat className="m-3 rounded-md border-2 p-2">
                    <StatLabel>Last Name</StatLabel>
                    <StatNumber>{userDataQuery?.data?.lastname}</StatNumber>
                  </Stat>
                </WrapItem>
              </>
            )}
          </Wrap>

          <Stat className="m-3 rounded-md border-2 p-2">
            <StatLabel>Phone Number</StatLabel>
            <StatNumber>{userDataQuery?.data?.phonenumber}</StatNumber>
          </Stat>
          {userDataQuery?.data?.userrole == "doctor" ||
          userDataQuery?.data?.userrole == "clinician" ? (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Primary Area of Speciality</StatLabel>
              <StatNumber>
                {userDataQuery?.data?.primaryareaofspeciality}
              </StatNumber>
            </Stat>
          ) : (
            ""
          )}

          {userDataQuery?.data?.userrole == "pharmacy" ||
          userDataQuery?.data?.userrole == "clinic" ? (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Location</StatLabel>
              <StatNumber>{userDataQuery?.data?.location}</StatNumber>
            </Stat>
          ) : (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>County of Practice</StatLabel>
              <StatNumber>{userDataQuery?.data?.countyofpractice}</StatNumber>
            </Stat>
          )}
          {userDataQuery?.data?.userrole == "pharmacy" ||
          userDataQuery?.data?.userrole == "clinic" ? (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Name</StatLabel>
              <StatNumber>{userDataQuery?.data?.estname}</StatNumber>
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
            {(bookingsQuery?.data ?? new Array<Booking>()).map(
              (booking, index) => {
                return (
                  <BookingEntryComponent
                    key={index}
                    name={booking?.name}
                      index={index +1}
                    mobileNumber={booking?.mobilenumber}
                  />
                );
              },
            )}
          </div>
        </div>
      </Skeleton>
    );
  }
}
function BookingEntryComponent({
  name,
  mobileNumber,
  index
}: {
  name: string;
  mobileNumber: string;
  index:number;
}) {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">Booking {index}</Heading>
      </CardHeader>

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
