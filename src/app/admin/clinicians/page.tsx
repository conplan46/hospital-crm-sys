'use client'
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Skeleton, useToast } from "@chakra-ui/react";
import { Clinicians } from "utils/used-types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
export default function CliniciansView() {
  const callBackUrl = usePathname()
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: callBackUrl });
  }
  const toast = useToast();
  const [loading, setLoading] = useState(false)
  const [clinicians, setClinicians] = useState<Clinicians | undefined>(undefined)
  useEffect(() => {
    setLoading(true);
    fetch("/api/get-clinicians", { headers: { 'Content-Type': 'application/json' }, method: "GET" }).then(data => data.json()).then((data: { status: string, clinicians: Clinicians }) => {
      setLoading(false);
      if (data?.status === 'success') {
        setClinicians(data?.clinicians)
      } else {
        toast({ status: "error", description: "An error occured fetching clinicians" });
      }
    }
    ).catch(err => console.error(err))
  }, [])
  console.log({ session })
  return (
    <Skeleton isLoaded={!loading}>
      <main className="w-full">
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
              {clinicians?.map((clinician, index) => {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{`${clinician?.firstname} ${clinician?.lastname}`}</td>
                    <td>{clinician?.phonenumber}</td>
                    <td>{clinician?.primaryareaofspeciality}</td>
                    <td>{clinician?.countyofpractice}</td>
                  </tr>

                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Primary area of Speciality</th>
                <th>County of practice</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    </Skeleton>
  );
}