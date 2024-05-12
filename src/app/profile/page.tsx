"use client";
import {
  Skeleton,
  SkeletonText,
  Stat,
  StatLabel,
  StatNumber,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Clinic,
  Clinician,
  Doctor,
  Patient,
  Pharmacy,
  User,
  UserData,
  UserDataAl,
} from "utils/used-types";
import Loading from "../loading";
export default function ProfilePage() {
  const callBackUrl = usePathname();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: callBackUrl });
  }
  const [isClient, setIsClient] = useState(false)
  const [userData, setUserData] = useState<UserDataAl>();
  useEffect(() => {
    setIsClient(true)
    setLoading(true);
    fetch("/api/get-user-data", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session?.user?.email }),
      method: "POST",
    })
      .then((data) => data.json())
      .then((data: { status: string; data: UserData }) => {
        console.log(data);
        setUserData(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [session]);
  if (status == "loading") {
    return (<Loading />)
  }
  if (!isClient) {
    return (
      <Loading />
    )
  }

  if (isClient && status == "authenticated") {
    return (
      <Skeleton isLoaded={!loading}>
        <div className="flex flex-row items-baseline">
          <div className="avatar placeholder m-2">
            <div className="w-24 rounded-full bg-neutral text-neutral-content">
              <span className="text-3xl">D</span>
            </div>
          </div>
          <div className="m-2 flex flex-col">
            <h1>profile</h1>
            <span className="text-3xl">
              {userData?.userrole == "pharmacy" || userData?.userrole == "clinic"
                ? userData?.estname
                : `${userData?.firstname} ${userData?.lastname}`}
            </span>
            <span className="mt-2">{userData?.userrole}</span>{" "}
          </div>
        </div>
        <div>
          <Wrap>
            {userData?.userrole == "pharmacy" ||
              userData?.userrole == "clinic" ? (
              <WrapItem>
                <Stat className="m-3 rounded-md border-2 p-2">
                  <StatLabel>Establishment Name</StatLabel>
                  <StatNumber>{userData?.estname}</StatNumber>
                </Stat>
              </WrapItem>
            ) : (
              <>
                <WrapItem>
                  <Stat className="m-3 rounded-md border-2 p-2">
                    <StatLabel>First Name</StatLabel>
                    <StatNumber>{userData?.firstname}</StatNumber>
                  </Stat>
                </WrapItem>
                <WrapItem>
                  <Stat className="m-3 rounded-md border-2 p-2">
                    <StatLabel>Last Name</StatLabel>
                    <StatNumber>{userData?.lastname}</StatNumber>
                  </Stat>
                </WrapItem>
              </>
            )}
          </Wrap>

          <Stat className="m-3 rounded-md border-2 p-2">
            <StatLabel>Phone Number</StatLabel>
            <StatNumber>{userData?.phonenumber}</StatNumber>
          </Stat>
          {userData?.userrole == "doctor" || userData?.userrole == "clinician" ? (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Primary Area of Speciality</StatLabel>
              <StatNumber>{userData?.primaryareaofspeciality}</StatNumber>
            </Stat>
          ) : (
            ""
          )}

          {userData?.userrole == "pharmacy" || userData?.userrole == "clinic" ? (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Location</StatLabel>
              <StatNumber>{userData?.location}</StatNumber>
            </Stat>
          ) : (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>County of Practice</StatLabel>
              <StatNumber>{userData?.countyofpractice}</StatNumber>
            </Stat>
          )}
          {userData?.userrole == "pharmacy" || userData?.userrole == "clinic" ? (
            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Name</StatLabel>
              <StatNumber>{userData?.estname}</StatNumber>
            </Stat>
          ) : (
            ""
          )}
        </div>
      </Skeleton>
    )
  }
}
