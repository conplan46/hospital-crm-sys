"use client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Button,
  Wrap,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  AlertDialogCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  WrapItem,
  IconButton,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { areaCodes } from "utils/area-codes";
import { MdPhoto } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import storage from "utils/firebase-config";
import type {
  ClinicDataForm,
  ClinicianDataForm,
  DoctorDataForm,
  Lab,
  LabDataForm,
  NurseDataForm,
  PatientRegistrationForm,
  PharmacyDataForm,
} from "utils/used-types";
import type { Session } from "next-auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
export default function NewUserPage() {
  const toast = useToast();
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };
  const cancelRef = useRef(null);
  const { data: session, status } = useSession();
  const pathName = usePathname();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: pathName });
  }

  /*  useEffect(() => {
     if (!queried) {
       if (!isOpen) {
         onOpen()
         setQueried(true)
 
       }
     }
 
   }, []) */

  return (
    <Tabs index={tabIndex} onChange={handleTabsChange} variant="enclosed">
      <TabList>
        <Tab>Clinician</Tab>
        <Tab>Clinic</Tab>
        <Tab>Pharmacy</Tab>
        <Tab>Doctor</Tab>
        <Tab>Lab</Tab>
        <Tab>Patient</Tab>
        <Tab>Nurse</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ClinicianComponent router={router} session={session} />
        </TabPanel>
        <TabPanel>
          <ClinicComponent router={router} session={session} />
        </TabPanel>
        <TabPanel>
          <PharmacyComponent router={router} session={session} />
        </TabPanel>
        <TabPanel>
          <DoctorComponent router={router} session={session} />
        </TabPanel>
        <TabPanel>
          <LabComponent router={router} session={session} />
        </TabPanel>
        <TabPanel>
          <PatientComponent router={router} session={session} />
        </TabPanel>
        <TabPanel>
          <NurseComponent router={router} session={session} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
function DoctorComponent({
  session,
  router,
}: {
  session: Session | null;
  router: AppRouterInstance;
}) {
  const [residence, setResidence] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DoctorDataForm>();
  const onSubmit: SubmitHandler<DoctorDataForm> = async (data) => {
    console.log(data);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    /*    if (session?.user?.email) {
         data = { ...data, email: session?.us}
       } */
    const formData = new FormData();
    const phoneNumber = areaCode + data.phoneNumber;
    if (session?.user?.email) {
      setIsSubmitting(true);

      formData.append("email", session?.user?.email);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("countyOfPractice", data.countyOfPractice);
      formData.append("primaryAreaOfSpeciality", data.primaryAreaOfSpeciality);
      formData.append("practicingLicense", data.practicingLicense);
      fetch("/api/create-doctor", { method: "POST", body: formData })
        .then((data) => data.json())
        .then((result: { status: string }) => {
          if (result.status == "doctor added") {
            setIsSubmitting(false);
            toast({
              title: "Data received.",
              description: "We've created a Doctor account for you.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            void router.push("/");
            //if user was added successfully sign up with new use and redirect to new-user page
          } else {
            setIsSubmitting(false);

            toast({
              title: "Error",
              description: result.status,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="font-manrope p-2">
      <div className="m-6 grid rounded-lg  bg-white sm:col-start-2">
        <div className="m-3 flex flex-col items-center">
          <h1 className="m-2 text-2xl font-bold text-black">
            Create Doctor Account
          </h1>
        </div>
        <Center>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl m={4} isInvalid={Boolean(errors.firstName)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                First Name
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Enter your first Name"
                {...register("firstName", {
                  required: "name is required",
                })}
              />
              <FormErrorMessage>{errors?.firstName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl m={4} isInvalid={Boolean(errors.lastName)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                Last Name
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Enter your last Name"
                {...register("lastName", {
                  required: "name is required",
                })}
              />
              <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl m={4} isInvalid={Boolean(errors.phoneNumber)}>
              <FormLabel htmlFor="name">Phone Number</FormLabel>
              <div className="join">
                <Select
                  className="join-item"
                  onChange={(e) => {
                    setAreaCode(e.target.value);
                    areaCodes.forEach(
                      (val: { code: string; name: string }, index) => {
                        if (val.code == e.target.value) {
                          setResidence(val.name);
                        }
                      },
                    );
                  }}
                >
                  <option disabled selected>
                    Area Code
                  </option>
                  {areaCodes.map(
                    (val: { code: string; name: string }, index) => {
                      return (
                        <option key={index} value={val.code}>
                          {val.name} {val.code}
                        </option>
                      );
                    },
                  )}
                </Select>
                <Input
                  id="name"
                  className="join-item"
                  placeholder="phoneNumber"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                />
              </div>
              <FormErrorMessage>
                {errors?.phoneNumber?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              m={4}
              isInvalid={Boolean(errors.primaryAreaOfSpeciality)}
            >
              <FormLabel className="font-bold text-black" htmlFor="name">
                Primary area of speciality
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Primary area of speciality"
                {...register("primaryAreaOfSpeciality", {
                  required: "field is required",
                })}
              />
              <FormErrorMessage>
                {errors?.phoneNumber?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl m={4} isInvalid={Boolean(errors.countyOfPractice)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                County of practice
              </FormLabel>
              <Input
                className="w-full"
                placeholder="County of practice"
                {...register("countyOfPractice", {
                  required: "field is required",
                })}
              />
              <FormErrorMessage>
                {errors?.countyOfPractice?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              className="mb-4"
              isInvalid={Boolean(errors.practicingLicense)}
            >
              <FormLabel className="font-bold text-black" htmlFor="name">
                Practicing license
              </FormLabel>
              <input
                {...register("practicingLicense", {
                  required: "practicing license is required",
                })}
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
              />

              <FormErrorMessage>
                {errors?.practicingLicense?.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              m={4}
              isLoading={isSubmitting}
              loadingText="Submitting"
              bgColor="#285430"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Center>
      </div>
    </div>
  );
}
function NurseComponent({
  session,
  router,
}: {
  session: Session | null;
  router: AppRouterInstance;
}) {
  const [residence, setResidence] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NurseDataForm>();
  const onSubmit: SubmitHandler<NurseDataForm> = async (data) => {
    console.log(data);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    /*    if (session?.user?.email) {
         data = { ...data, email: session?.us}
       } */
    const formData = new FormData();
    const phoneNumber = areaCode + data.phoneNumber;
    if (session?.user?.email) {
      setIsSubmitting(true);

      formData.append("email", session?.user?.email);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("countyOfPractice", data.countyOfPractice);
      formData.append("primaryAreaOfSpeciality", data.primaryAreaOfSpeciality);
      formData.append("practicingLicense", data.practicingLicenseNumber);
      fetch("/api/create-nurse", { method: "POST", body: formData })
        .then((data) => data.json())
        .then((result: { status: string }) => {
          if (result.status == "doctor added") {
            setIsSubmitting(false);
            toast({
              title: "Data received.",
              description: "We've created a Nurse account for you.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            void router.push("/");
            //if user was added successfully sign up with new use and redirect to new-user page
          } else {
            setIsSubmitting(false);

            toast({
              title: "Error",
              description: result.status,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="font-manrope p-2">
      <div className="m-6 grid rounded-lg  bg-white sm:col-start-2">
        <div className="m-3 flex flex-col items-center">
          <h1 className="m-2 text-2xl font-bold text-black">
            Create Nurse Account
          </h1>
        </div>
        <Center>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl m={4} isInvalid={Boolean(errors.firstName)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                First Name
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Enter your first Name"
                {...register("firstName", {
                  required: "name is required",
                })}
              />
              <FormErrorMessage>{errors?.firstName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl m={4} isInvalid={Boolean(errors.lastName)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                Last Name
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Enter your last Name"
                {...register("lastName", {
                  required: "name is required",
                })}
              />
              <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl m={4} isInvalid={Boolean(errors.phoneNumber)}>
              <FormLabel htmlFor="name">Phone Number</FormLabel>
              <div className="join">
                <Select
                  className="join-item"
                  onChange={(e) => {
                    setAreaCode(e.target.value);
                    areaCodes.forEach(
                      (val: { code: string; name: string }, index) => {
                        if (val.code == e.target.value) {
                          setResidence(val.name);
                        }
                      },
                    );
                  }}
                >
                  <option disabled selected>
                    Area Code
                  </option>
                  {areaCodes.map(
                    (val: { code: string; name: string }, index) => {
                      return (
                        <option key={index} value={val.code}>
                          {val.name} {val.code}
                        </option>
                      );
                    },
                  )}
                </Select>
                <Input
                  id="name"
                  className="join-item"
                  placeholder="phoneNumber"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                />
              </div>
              <FormErrorMessage>
                {errors?.phoneNumber?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              m={4}
              isInvalid={Boolean(errors.primaryAreaOfSpeciality)}
            >
              <FormLabel className="font-bold text-black" htmlFor="name">
                Primary area of speciality
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Primary area of speciality"
                {...register("primaryAreaOfSpeciality", {
                  required: "field is required",
                })}
              />
              <FormErrorMessage>
                {errors?.phoneNumber?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl m={4} isInvalid={Boolean(errors.countyOfPractice)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                County of practice
              </FormLabel>
              <Input
                className="w-full"
                placeholder="County of practice"
                {...register("countyOfPractice", {
                  required: "field is required",
                })}
              />
              <FormErrorMessage>
                {errors?.countyOfPractice?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              m={4}
              isInvalid={Boolean(errors.practicingLicenseNumber)}
            >
              <FormLabel className="font-bold text-black" htmlFor="name">
                Practice license number
              </FormLabel>
              <Input
                className="w-full"
                placeholder="practice license number"
                {...register("practicingLicenseNumber", {
                  required: "field is required",
                })}
              />
              <FormErrorMessage>
                {errors?.practicingLicenseNumber?.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              m={4}
              isLoading={isSubmitting}
              loadingText="Submitting"
              bgColor="#285430"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Center>
      </div>
    </div>
  );
}

function PatientComponent({
  session,
  router,
}: {
  session: Session | null;
  router: AppRouterInstance;
}) {
  const [residence, setResidence] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientRegistrationForm>();
  const onSubmit: SubmitHandler<PatientRegistrationForm> = async (data) => {
    console.log(data);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    /*    if (session?.user?.email) {
         data = { ...data, email: session?.us}
       } */
    const formData = new FormData();
    const phoneNumber = areaCode + data.phoneNumber;
    if (session?.user?.email) {
      setIsSubmitting(true);

      formData.append("email", session?.user?.email);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("phoneNumber", data.phoneNumber);
      fetch("/api/create-patient", { method: "POST", body: formData })
        .then((data) => data.json())
        .then((result: { status: string }) => {
          if (result.status == "patient added") {
            setIsSubmitting(false);
            toast({
              title: "Data received.",
              description: "We've created a patient account for you.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            void router.push("/");
            //if user was added successfully sign up with new use and redirect to new-user page
          } else {
            setIsSubmitting(false);

            toast({
              title: "Error",
              description: result.status,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="font-manrope p-2">
      <div className="m-6 grid rounded-lg  bg-white sm:col-start-2">
        <div className="m-3 flex flex-col items-center">
          <h1 className="m-2 text-2xl font-bold text-black">
            Create Patient Account
          </h1>
        </div>
        <Center>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl m={4} isInvalid={Boolean(errors.firstName)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                First Name
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Enter your first Name"
                {...register("firstName", {
                  required: "name is required",
                })}
              />
              <FormErrorMessage>{errors?.firstName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl m={4} isInvalid={Boolean(errors.lastName)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                Last Name
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Enter your last Name"
                {...register("lastName", {
                  required: "name is required",
                })}
              />
              <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl m={4} isInvalid={Boolean(errors.phoneNumber)}>
              <FormLabel htmlFor="name">Phone Number</FormLabel>
              <div className="join">
                <Select
                  className="join-item"
                  onChange={(e) => {
                    setAreaCode(e.target.value);
                    areaCodes.forEach(
                      (val: { code: string; name: string }, index) => {
                        if (val.code == e.target.value) {
                          setResidence(val.name);
                        }
                      },
                    );
                  }}
                >
                  <option disabled selected>
                    Area Code
                  </option>
                  {areaCodes.map(
                    (val: { code: string; name: string }, index) => {
                      return (
                        <option key={index} value={val.code}>
                          {val.name} {val.code}
                        </option>
                      );
                    },
                  )}
                </Select>
                <Input
                  id="name"
                  className="join-item"
                  placeholder="phoneNumber"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                />
              </div>
              <FormErrorMessage>
                {errors?.phoneNumber?.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              m={4}
              isLoading={isSubmitting}
              loadingText="Submitting"
              bgColor="#285430"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Center>
      </div>
    </div>
  );
}
function ClinicComponent({
  session,
  router,
}: {
  session: Session | null;
  router: AppRouterInstance;
}) {
  const [service, setService] = useState("");
  const [servicesList, setServicesList] = useState<Array<string>>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClinicDataForm>();
  const onSubmit: SubmitHandler<ClinicDataForm> = async (data) => {
    console.log(data);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    /*    if (session?.user?.email) {
         data = { ...data, email: session?.us}
       } */
    const formData = new FormData();
    const phoneNumber = areaCode + data.phoneNumber;
    if (session?.user?.email) {
      setIsSubmitting(true);
      formData.append("name", data.businessName);
      formData.append("email", session?.user?.email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("location", data.location);
      formData.append("services", JSON.stringify(servicesList));
      const storageRef = ref(
        storage,
        `licenses/${data?.practicingLicense?.[0]?.name}`,
      );

      const snapshot = await uploadBytes(
        storageRef,
        data?.practicingLicense?.[0] as Blob,
      );
      const url = await getDownloadURL(snapshot.ref);
      if (!url) {
        toast({
          description: "Error uploading practicing license",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        formData.append("practicingLicense", url);
        fetch("/api/create-clinic", { method: "POST", body: formData })
          .then((data) => data.json())
          .then((result: { status: string }) => {
            if (result.status == "clinic added") {
              setIsSubmitting(false);
              toast({
                title: "Data received.",
                description: "We've created a clinic account for you.",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              void router.push("/");
              //if user was added successfully sign up with new use and redirect to new-user page
            } else {
              setIsSubmitting(false);

              toast({
                title: "Error",
                description: result.status,
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }
          })
          .catch((err) => console.error(err));
      }
    }
  };
  const [residence, setResidence] = useState("");
  const [areaCode, setAreaCode] = useState("");
  return (
    <div className="font-manrope p-2 ">
      <div className="m-3 flex flex-col items-center">
        <h1 className="m-2 text-2xl font-bold text-black">
          Create Clinic Account
        </h1>
      </div>
      <Center>
        <form onSubmit={handleSubmit(onSubmit)} className="form-control m-4">
          <FormControl
            className="mb-4"
            isInvalid={Boolean(errors.businessName)}
          >
            <FormLabel className="font-bold text-black" htmlFor="name">
              Clinic Name
            </FormLabel>
            <Input
              className="w-full"
              placeholder="Enter your establishment's Name"
              {...register("businessName", {
                required: "name is required",
              })}
            />
            <FormErrorMessage>{errors?.businessName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl
            className="mb-4"
            isInvalid={Boolean(errors.practicingLicense)}
          >
            <FormLabel className="font-bold text-black" htmlFor="name">
              Practicing license
            </FormLabel>
            <input
              {...register("practicingLicense", {
                required: "practicing license is required",
              })}
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
            />

            <FormErrorMessage>
              {errors?.practicingLicense?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            className="mb-4"
            isInvalid={Boolean(servicesList.length == 0)}
          >
            <FormLabel className="font-bold text-black" htmlFor="name">
              Services
            </FormLabel>
            <div className="join">
              <input
                value={service}
                className="input join-item input-bordered"
                onChange={(e) => {
                  setService(e.target.value);
                  e.preventDefault();
                }}
                placeholder="service offered"
              />

              <button
                className="btn join-item rounded-r-full"
                type="button"
                onClick={() => {
                  if (service !== "") {
                    setServicesList([service, ...servicesList]);
                    setService("");
                  }
                }}
              >
                Add service
              </button>
            </div>
          </FormControl>
          <div className="mb-4 flex flex-col rounded border p-3">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Services</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {servicesList.map((service, index) => {
                    return (
                      <>
                        <Tr></Tr>
                        <Tr className="m-1" key={index}>
                          {service}
                        </Tr>
                      </>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>

            <FormErrorMessage>
              {servicesList?.length == 0 ? "services list empty" : ""}
            </FormErrorMessage>
          </div>
          <FormControl className="mb-4" isInvalid={Boolean(errors.phoneNumber)}>
            <FormLabel htmlFor="name">Phone Number</FormLabel>
            <div className="join">
              <Select
                className="join-item"
                onChange={(e) => {
                  setAreaCode(e.target.value);
                  areaCodes.forEach(
                    (val: { code: string; name: string }, index) => {
                      if (val.code == e.target.value) {
                        setResidence(val.name);
                      }
                    },
                  );
                }}
              >
                <option disabled selected>
                  Area Code
                </option>
                {areaCodes.map((val: { code: string; name: string }, index) => {
                  return (
                    <option key={index} value={val.code}>
                      {val.name} {val.code}
                    </option>
                  );
                })}
              </Select>
              <Input
                id="name"
                className="join-item"
                placeholder="phoneNumber"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
              />
            </div>
            <FormErrorMessage>{errors?.phoneNumber?.message}</FormErrorMessage>
          </FormControl>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Location</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <Button
            m={4}
            isLoading={isSubmitting}
            loadingText="Submitting"
            bgColor="#285430"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Center>
    </div>
  );
}
function ClinicianComponent({
  session,
  router,
}: {
  session: Session | null;
  router: AppRouterInstance;
}) {
  const [residence, setResidence] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClinicianDataForm>();
  const onSubmit: SubmitHandler<ClinicianDataForm> = async (data) => {
    console.log(data);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    /*    if (session?.user?.email) {
         data = { ...data, email: session?.us}
       } */
    const formData = new FormData();
    const phoneNumber = areaCode + data.phoneNumber;
    if (session?.user?.email) {
      setIsSubmitting(true);
      formData.append("email", session?.user?.email);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("countyOfPractice", data.countyOfPractice);
      formData.append("primaryAreaOfSpeciality", data.primaryAreaOfSpeciality);
      formData.append("practicingLicense", data.practicingLicenseNumber);

      fetch("/api/create-clinician", { method: "POST", body: formData })
        .then((data) => data.json())
        .then((result: { status: string }) => {
          if (result.status == "clinician added") {
            setIsSubmitting(false);
            toast({
              title: "Data received.",
              description: "We've created a clinician account for you.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            void router.push("/");
            //if user was added successfully sign up with new use and redirect to new-user page
          } else {
            setIsSubmitting(false);

            toast({
              title: "Error",
              description: result.status,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="font-manrope p-2 ">
      <div className="m-6 grid rounded-lg  bg-white sm:col-start-2">
        <div className="m-3 flex flex-col items-center">
          <h1 className="m-2 text-2xl font-bold text-black">
            Create Clinician Account
          </h1>
        </div>
        <Center>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl m={4} isInvalid={Boolean(errors.firstName)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                First Name
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Enter your first Name"
                {...register("firstName", {
                  required: "name is required",
                })}
              />
              <FormErrorMessage>{errors?.firstName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl m={4} isInvalid={Boolean(errors.lastName)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                Last Name
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Enter your last Name"
                {...register("lastName", {
                  required: "name is required",
                })}
              />
              <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl m={4} isInvalid={Boolean(errors.phoneNumber)}>
              <FormLabel htmlFor="name">Phone Number</FormLabel>
              <div className="join">
                <Select
                  className="join-item"
                  onChange={(e) => {
                    setAreaCode(e.target.value);
                    areaCodes.forEach(
                      (val: { code: string; name: string }, index) => {
                        if (val.code == e.target.value) {
                          setResidence(val.name);
                        }
                      },
                    );
                  }}
                >
                  <option disabled selected>
                    Area Code
                  </option>
                  {areaCodes.map(
                    (val: { code: string; name: string }, index) => {
                      return (
                        <option key={index} value={val.code}>
                          {val.name} {val.code}
                        </option>
                      );
                    },
                  )}
                </Select>
                <Input
                  id="name"
                  className="join-item"
                  placeholder="phoneNumber"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                />
              </div>
              <FormErrorMessage>
                {errors?.phoneNumber?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              m={4}
              isInvalid={Boolean(errors.primaryAreaOfSpeciality)}
            >
              <FormLabel className="font-bold text-black" htmlFor="name">
                Primary area of speciality
              </FormLabel>
              <Input
                className="w-full"
                placeholder="Primary area of speciality"
                {...register("primaryAreaOfSpeciality", {
                  required: "field is required",
                })}
              />
              <FormErrorMessage>
                {errors?.phoneNumber?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl m={4} isInvalid={Boolean(errors.countyOfPractice)}>
              <FormLabel className="font-bold text-black" htmlFor="name">
                County of practice
              </FormLabel>
              <Input
                placeholder="County of practice"
                {...register("countyOfPractice", {
                  required: "field is required",
                })}
              />
              <FormErrorMessage>
                {errors?.countyOfPractice?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              m={4}
              isInvalid={Boolean(errors.practicingLicenseNumber)}
            >
              <FormLabel className="font-bold text-black" htmlFor="name">
                Practicing license Number
              </FormLabel>
              <Input
                {...register("practicingLicenseNumber", {
                  required: "practicing license number is required",
                })}
                placeholder="enter practicing license number"
                type="text"
              />

              <FormErrorMessage>
                {errors?.practicingLicenseNumber?.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              m={4}
              isLoading={isSubmitting}
              loadingText="Submitting"
              bgColor="#285430"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Center>
      </div>
    </div>
  );
}
function PharmacyComponent({
  session,
  router,
}: {
  session: Session | null;
  router: AppRouterInstance;
}) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PharmacyDataForm>();
  const [residence, setResidence] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const onSubmit: SubmitHandler<PharmacyDataForm> = async (data) => {
    console.log(data);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    /*    if (session?.user?.email) {
         data = { ...data, email: session?.us}
       } */
    const formData = new FormData();
    const phoneNumber = areaCode + data.phoneNumber;
    if (session?.user?.email) {
      setIsSubmitting(true);

      formData.append("name", data.businessName);
      formData.append("email", session?.user?.email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("location", data.location);
      formData.append("licenseNumber", data.licenseNumber);
      formData.append(
        "facilityRegistrationNumber",
        data.facilityRegistrationNumber,
      );

      fetch("/api/create-pharmacy", { method: "POST", body: formData })
        .then((data) => data.json())
        .then((result: { status: string }) => {
          if (result.status == "pharmacy added") {
            setIsSubmitting(false);
            toast({
              title: "Data received.",
              description: "We've created a Pharmacy account for you.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            void router.push("/");
            //if user was added successfully sign up with new use and redirect to new-user page
          } else {
            setIsSubmitting(false);

            toast({
              title: "Error",
              description: result.status,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  };
  return (
    <div className="font-manrope p-2 ">
      <div className="m-3 flex flex-col items-center">
        <h1 className="m-2 text-2xl font-bold text-black">
          Create Pharmacy Account
        </h1>
      </div>
      <Center>
        <form onSubmit={handleSubmit(onSubmit)} className="form-control m-4">
          <FormControl
            className="mb-6"
            isInvalid={Boolean(errors.businessName)}
          >
            <FormLabel className="font-bold text-black" htmlFor="name">
              Pharmacy Name
            </FormLabel>
            <Input
              className="w-full"
              placeholder="Enter your establishment's Name"
              {...register("businessName", {
                required: "name is required",
              })}
            />
            <FormErrorMessage>{errors?.businessName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl
            className="mb-6"
            isInvalid={Boolean(errors.licenseNumber)}
          >
            <FormLabel className="font-bold text-black" htmlFor="name">
              License Number
            </FormLabel>
            <Input
              className="w-full"
              placeholder="Enter license number"
              {...register("licenseNumber", {
                required: "license number is required",
              })}
              type="text"
            />

            <FormErrorMessage>
              {errors?.licenseNumber?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            className="mb-6"
            isInvalid={Boolean(errors.facilityRegistrationNumber)}
          >
            <FormLabel className="font-bold text-black" htmlFor="name">
              Facility Registration Number
            </FormLabel>
            <Input
              className="w-full"
              {...register("facilityRegistrationNumber", {
                required: "facility registration number required",
              })}
              placeholder="Enter Facility Registration Number"
              type="text"
            />

            <FormErrorMessage>
              {errors?.facilityRegistrationNumber?.message}
            </FormErrorMessage>
          </FormControl>
          <label className="form-control mb-4 w-full max-w-xs">
            <div className="label">
              <span className="label-text">Location</span>
            </div>
            <input
              type="text"
              {...register("location", {
                required: "establishment location is required ",
              })}
              placeholder="Enter establishment location"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <FormControl isInvalid={Boolean(errors.phoneNumber)}>
            <FormLabel htmlFor="name">Phone Number</FormLabel>
            <div className="join">
              <Select
                className="join-item"
                onChange={(e) => {
                  setAreaCode(e.target.value);
                  areaCodes.forEach(
                    (val: { code: string; name: string }, index) => {
                      if (val.code == e.target.value) {
                        setResidence(val.name);
                      }
                    },
                  );
                }}
              >
                <option disabled selected>
                  Area Code
                </option>
                {areaCodes.map((val: { code: string; name: string }, index) => {
                  return (
                    <option key={index} value={val.code}>
                      {val.name} {val.code}
                    </option>
                  );
                })}
              </Select>
              <Input
                id="name"
                className="join-item"
                placeholder="phoneNumber"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
              />
            </div>
            <FormErrorMessage>{errors?.phoneNumber?.message}</FormErrorMessage>
          </FormControl>
          <Button
            m={4}
            isLoading={isSubmitting}
            loadingText="Submitting"
            bgColor="#285430"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Center>
    </div>
  );
}
function LabComponent({
  session,
  router,
}: {
  session: Session | null;
  router: AppRouterInstance;
}) {
  const [service, setService] = useState("");
  const [servicesList, setServicesList] = useState<Array<string>>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LabDataForm>();
  const onSubmit: SubmitHandler<LabDataForm> = async (data) => {
    console.log(data);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    /*    if (session?.user?.email) {
         data = { ...data, email: session?.us}
       } */
    const formData = new FormData();
    const phoneNumber = areaCode + data.phoneNumber;
    if (session?.user?.email) {
      setIsSubmitting(true);
      formData.append("name", data.businessName);
      formData.append("email", session?.user?.email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("location", data.location);
      formData.append("services", JSON.stringify(servicesList));
      const storageRef = ref(
        storage,
        `licenses/${data?.practicingLicense?.[0]?.name}`,
      );

      const snapshot = await uploadBytes(
        storageRef,
        data?.practicingLicense?.[0] as Blob,
      );
      const url = await getDownloadURL(snapshot.ref);
      if (!url) {
        toast({
          description: "Error uploading practicing license",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        formData.append("practicingLicense", url);
        fetch("/api/create-lab", { method: "POST", body: formData })
          .then((data) => data.json())
          .then((result: { status: string }) => {
            if (result.status == "lab added") {
              setIsSubmitting(false);
              toast({
                title: "Data received.",
                description: "We've created a lab account for you.",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              void router.push("/");
              //if user was added successfully sign up with new use and redirect to new-user page
            } else {
              setIsSubmitting(false);

              toast({
                title: "Error",
                description: result.status,
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }
          })
          .catch((err) => console.error(err));
      }
    }
  };
  const [residence, setResidence] = useState("");
  const [areaCode, setAreaCode] = useState("");
  return (
    <div className="font-manrope p-2 ">
      <div className="m-3 flex flex-col items-center">
        <h1 className="m-2 text-2xl font-bold text-black">
          Create Lab Account
        </h1>
      </div>
      <Center>
        <form onSubmit={handleSubmit(onSubmit)} className="form-control m-4">
          <FormControl
            className="mb-4"
            isInvalid={Boolean(errors.businessName)}
          >
            <FormLabel className="font-bold text-black" htmlFor="name">
              Lab Name
            </FormLabel>
            <Input
              className="w-full"
              placeholder="Enter your establishment's Name"
              {...register("businessName", {
                required: "name is required",
              })}
            />
            <FormErrorMessage>{errors?.businessName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl
            className="mb-4"
            isInvalid={Boolean(errors.practicingLicense)}
          >
            <FormLabel className="font-bold text-black" htmlFor="name">
              Practicing license
            </FormLabel>
            <input
              {...register("practicingLicense", {
                required: "practicing license is required",
              })}
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
            />

            <FormErrorMessage>
              {errors?.practicingLicense?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            className="mb-4"
            isInvalid={Boolean(servicesList.length == 0)}
          >
            <FormLabel className="font-bold text-black" htmlFor="name">
              Services
            </FormLabel>
            <div className="join">
              <input
                value={service}
                className="input join-item input-bordered"
                onChange={(e) => {
                  setService(e.target.value);
                  e.preventDefault();
                }}
                placeholder="service offered"
              />

              <button
                className="btn join-item rounded-r-full"
                type="button"
                onClick={() => {
                  if (service !== "") {
                    setServicesList([service, ...servicesList]);
                    setService("");
                  }
                }}
              >
                Add service
              </button>
            </div>
          </FormControl>

          <div className="mb-4 flex flex-col rounded border p-3">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Services</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {servicesList.map((service, index) => {
                    return (
                      <>
                        <Tr></Tr>
                        <Tr className="m-1" key={index}>
                          {service}
                        </Tr>
                      </>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>

            <FormErrorMessage>
              {servicesList?.length == 0 ? "services list empty" : ""}
            </FormErrorMessage>
          </div>
          <FormControl className="mb-4" isInvalid={Boolean(errors.phoneNumber)}>
            <FormLabel htmlFor="name">Phone Number</FormLabel>
            <div className="join">
              <Select
                className="join-item"
                onChange={(e) => {
                  setAreaCode(e.target.value);
                  areaCodes.forEach(
                    (val: { code: string; name: string }, index) => {
                      if (val.code == e.target.value) {
                        setResidence(val.name);
                      }
                    },
                  );
                }}
              >
                <option disabled selected>
                  Area Code
                </option>
                {areaCodes.map((val: { code: string; name: string }, index) => {
                  return (
                    <option key={index} value={val.code}>
                      {val.name} {val.code}
                    </option>
                  );
                })}
              </Select>
              <Input
                id="name"
                className="join-item"
                placeholder="phoneNumber"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
              />
            </div>
            <FormErrorMessage>{errors?.phoneNumber?.message}</FormErrorMessage>
          </FormControl>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Location</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <Button
            m={4}
            isLoading={isSubmitting}
            loadingText="Submitting"
            bgColor="#285430"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Center>
    </div>
  );
}
