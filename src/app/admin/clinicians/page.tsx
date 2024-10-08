"use client";

import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Skeleton, useToast } from "@chakra-ui/react";
import { Clinicians } from "utils/used-types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loading from "~/app/loading";
export default function CliniciansView() {
  const callBackUrl = usePathname();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: callBackUrl });
  }

  const [isClient, setIsClient] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [clinicians, setClinicians] = useState<Clinicians | undefined>(
    undefined,
  );
  useEffect(() => {
    setIsClient(true);
    setLoading(true);
    fetch("/api/get-clinicians", {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    })
      .then((data) => data.json())
      .then((data: { status: string; clinicians: Clinicians }) => {
        setLoading(false);
        if (data?.status === "success") {
          setClinicians(data?.clinicians);
        } else {
          toast({
            status: "error",
            description: "An error occured fetching clinicians",
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);
  if (status == "loading") {
    return <Loading />;
  }
  if (!isClient) {
    return <Loading />;
  }

  console.log({ session });
  if (status === "authenticated" && isClient) {
    return (
      <Skeleton isLoaded={!loading}>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Primary area of Speciality</th>
                <th>County of practice</th>
              </tr>
            </thead>
            <tbody>
              {clinicians?.length != 0 ? (
                clinicians?.map((clinician, index) => {
                  return (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{`${clinician?.firstname} ${clinician?.lastname}`}</td>
                      <td>{clinician?.phonenumber}</td>
                      <td>{clinician?.primaryareaofspeciality}</td>
                      <td>{clinician?.countyofpractice}</td>
                    </tr>
                  );
                })
              ) : (
                <div className="flex w-screen items-center justify-center">
                  <h1 className="text-xl">no clinicians have signed up</h1>
                </div>
              )}
            </tbody>
          </table>
        </div>
      </Skeleton>
    );
  }
}
