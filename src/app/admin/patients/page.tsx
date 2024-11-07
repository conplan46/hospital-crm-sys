"use client";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Box, Button, Card, CardBody, CardHeader, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Stack, StackDivider, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { Clinicians, Patient, Patients } from "utils/used-types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loading from "~/app/loading";
export default function PatientsView() {
  const { data: session, status } = useSession();
  const callBackUrl = usePathname();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: callBackUrl });
  }
  const [currPatient, setCurrPatient] = useState<Patient | undefined>(undefined)
  const [isClient, setIsClient] = useState(false)
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patients | undefined>(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    setIsClient(true);
    setLoading(true);
    fetch("/api/get-patients", {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    })
      .then((data) => data.json())
      .then((data: { status: string; patients: Patients }) => {
        setLoading(false);
        if (data?.status === "success") {
          setPatients(data?.patients);
        } else {
          toast({
            status: "error",
            description: "An error occured fetching clinicians",
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);
  console.log({ session });

  if (!isClient) {
    return <Loading />;
  }
  if (status == "loading") {
    return <Loading />;
  }

  if (isClient && status == "authenticated") {
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
                {patients?.length != 0 ? (
                  patients?.map((patient, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <th>{index + 1}</th>
                          <td>{`${patient.name}`}</td>
                          <td>{patient?.phonenumber}</td>
                          <td><Button onClick={() => {
                            onOpen();
                            setCurrPatient(patient)
                          }}>view</Button> </td>
                        </tr>
                        <Modal isOpen={isOpen} onClose={onClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader></ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <Card>
                                <CardHeader>
                                  <Heading size='md'>Patient Booking</Heading>
                                </CardHeader>

                                <CardBody>
                                  <Stack divider={<StackDivider />} spacing='4'>
                                    <Box>
                                      <Heading size='xs' textTransform='uppercase'>
                                        Name
                                      </Heading>
                                      <Text pt='2' fontSize='sm'>
                                        {currPatient?.name}
                                      </Text>
                                    </Box>
                                    <Box>
                                      <Heading size='xs' textTransform='uppercase'>
                                        Prescription Request
                                      </Heading>
                                      <Text pt='2' fontSize='sm'>
                                        {currPatient?.prescription_request}
                                      </Text>
                                    </Box>
                                    <Box>
                                      <Heading size='xs' textTransform='uppercase'>
                                        Patient Complaint
                                      </Heading>
                                      <Text pt='2' fontSize='sm'>
                                        {currPatient?.patient_complaint}
                                      </Text>
                                    </Box>
                                    <Box>
                                      <Heading size='xs' textTransform='uppercase'>
                                        Lab test Request
                                      </Heading>
                                      <Text pt='2' fontSize='sm'>
                                        {`${currPatient?.lab_test_request}`}
                                      </Text>
                                    </Box>
                                    <Box>
                                      <Heading size='xs' textTransform='uppercase'>
                                        Medical Exam Request
                                      </Heading>
                                      <Text pt='2' fontSize='sm'>
                                        {`${currPatient?.medical_exam_request}`}
                                      </Text>
                                    </Box>

                                    <Box>
                                      <Heading size='xs' textTransform='uppercase'>
                                        Nurse Visit
                                      </Heading>
                                      <Text pt='2' fontSize='sm'>
                                        {currPatient?.nurse_visit}
                                      </Text>
                                    </Box>
                                    <Box>
                                      <Heading size='xs' textTransform='uppercase'>
                                        Phone Number
                                      </Heading>
                                      <Text pt='2' fontSize='sm'>
                                        {currPatient?.phonenumber}
                                      </Text>
                                    </Box>

                                  </Stack>
                                </CardBody>
                              </Card>
                            </ModalBody>

                            <ModalFooter>
                              <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                              </Button>
                              <Button variant='ghost'>Mark Attended</Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal></>
                    );
                  })
                ) : (
                  <div className="flex w-screen items-center justify-center">
                    <h1 className="text-xl">no patients have signed up</h1>
                  </div>)}
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
    )
  }
}
