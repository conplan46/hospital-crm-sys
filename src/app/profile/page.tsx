"use client";
import { SkeletonCircle, SkeletonText, Stat, StatLabel, StatNumber, Wrap, WrapItem } from "@chakra-ui/react";
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
export default function ProfilePage() {
  const callBackUrl = usePathname();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: callBackUrl });
  }
  const [userData, setUserData] = useState<UserDataAl>();
  useEffect(() => {
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
  return (
    <div>
      <div className="flex flex-row items-baseline">
        <div className="avatar placeholder m-2">
          <div className="w-24 rounded-full bg-neutral text-neutral-content">
            <span className="text-3xl">D</span>
          </div>
        </div>
        <div className="m-2 flex flex-col">
          <SkeletonText isLoaded={!loading}>
            <h1>profile</h1>

            <span className="text-3xl">{userData?.userrole == "pharmacy" || userData?.userrole == "clinic" ? userData?.estname : `${userData?.firstname} ${userData?.lastname}`}</span></SkeletonText>

          <SkeletonText isLoaded={!loading}> <span className="mt-2">{userData?.userrole}</span></SkeletonText>
        </div>
      </div>
      <div>
        <Wrap>
          {userData?.userrole == "pharmacy" || userData?.userrole == "clinic" ? (

            <WrapItem>
              <SkeletonText isLoaded={!loading}>
                <Stat className="m-3 rounded-md border-2 p-2">
                  <StatLabel>Establishment Name</StatLabel>
                  <StatNumber>{userData?.estname}</StatNumber>
                </Stat>
              </SkeletonText>
            </WrapItem>

          ) : (<>
            <WrapItem>
              <SkeletonText isLoaded={!loading}>

                <Stat className="m-3 rounded-md border-2 p-2">
                  <StatLabel>First Name</StatLabel>
                  <StatNumber>{userData?.firstname}</StatNumber>
                </Stat>
              </SkeletonText>
            </WrapItem>
            <WrapItem>
              <SkeletonText isLoaded={!loading}>

                <Stat className="m-3 rounded-md border-2 p-2">
                  <StatLabel>Last Name</StatLabel>
                  <StatNumber>{userData?.lastname}</StatNumber>
                </Stat>
              </SkeletonText>
            </WrapItem></>
          )}
        </Wrap>
        <SkeletonText isLoaded={!loading}>

          <Stat className="m-3 rounded-md border-2 p-2">
            <StatLabel>Phone Number</StatLabel>
            <StatNumber>{userData?.phonenumber}</StatNumber>
          </Stat>
        </SkeletonText>
        {userData?.userrole == "doctor" || userData?.userrole == 'clinician' ? (
          <SkeletonText isLoaded={!loading}>

            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Primary Area of Speciality</StatLabel>
              <StatNumber>{userData?.primaryareaofspeciality}</StatNumber>
            </Stat>
          </SkeletonText>
        ) : ('')}

        {userData?.userrole == "pharmacy" || userData?.userrole == "clinic" ? (
          <SkeletonText isLoaded={!loading}>

            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Location</StatLabel>
              <StatNumber>{userData?.location}</StatNumber>
            </Stat>
          </SkeletonText>
        ) : (
          <SkeletonText isLoaded={!loading}>

            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>County of Practice</StatLabel>
              <StatNumber>{userData?.countyofpractice}</StatNumber>
            </Stat>
          </SkeletonText>
        )}
        {userData?.userrole == "pharmacy" || userData?.userrole == "clinic" ? (
          <SkeletonText isLoaded={!loading}>

            <Stat className="m-3 rounded-md border-2 p-2">
              <StatLabel>Name</StatLabel>
              <StatNumber>{userData?.estname}</StatNumber>
            </Stat>
          </SkeletonText>
        ) : (''
        )}
      </div>
    </div>
  );
}
