'use client'
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button, Skeleton, useToast } from "@chakra-ui/react";
import { Clinicians, Patients } from "utils/used-types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
export default function PatientsView() {
  const { data: session, status } = useSession();
  const callBackUrl = usePathname();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: callBackUrl });
  }
  const toast = useToast();
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState<Patients | undefined>(undefined)
  useEffect(() => {
    setLoading(true);
    fetch("/api/get-patients", { headers: { 'Content-Type': 'application/json' }, method: "GET" }).then(data => data.json()).then((data: { status: string, patients: Patients }) => {
      setLoading(false);
      if (data?.status === 'success') {
        setPatients(data?.patients)
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
              </tr>
            </thead>
            <tbody>
              {patients?.map((patient, index) => {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{`${patient?.firstname} ${patient?.lastname}`}</td>
                    <td>{patient?.phonenumber}</td>
                  </tr>

                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Phone Number</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    </Skeleton>

  );
}
