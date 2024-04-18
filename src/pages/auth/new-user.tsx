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
  AlertDialogCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head"
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { areaCodes } from "~/utils/area-codes";
const onboardingDataSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  email: z.string().optional(),
  primaryAreaOfSpeciality: z.string().optional(),
  countyOfPractice: z.string().optional(),
});
type OnboardingData = z.infer<typeof onboardingDataSchema>
export default function NewUserPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingData>();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [areaCode, setAreaCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [residence, setResidence] = useState("");
  const [queried, setQueried] = useState(false);
  const [isClinician, setIsClinician] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();
  const cancelRef = useRef(null)
  console.log({ queried })
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: router?.asPath });
  }

  useEffect(() => {
    if (!queried) {
      if (!isOpen) {
        onOpen()
        setQueried(true)

      }
    }

  }, [])
  const onSubmit: SubmitHandler<OnboardingData> = (data) => {
    console.log(data)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (session?.user?.email) {
      data = { ...data, email: session?.user?.email }
    }
    if (isClinician) {
      fetch("/api/create-clinician", { headers: { 'Content-Type': 'application/json' }, method: "POST", body: JSON.stringify(data) }).then(data => data.json())
        .then((result: { status: string; }) => {
          if (result.status == "clinician added") {
            setIsSubmitting(false);
            toast({
              title: "Data received.",
              description: "We've created a clinician account for you.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            void router.push('/')
              //if user was added successfully sign up with new use and redirect to new-user page
              ;
          } else {
            setIsSubmitting(false);

            toast({
              title: "Error",
              description: result.status,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
            ;
          }
        })
        .catch(err => console.error(err))
    } else {
      fetch("/api/create-patient", { headers: { 'Content-Type': 'application/json' }, method: "POST", body: JSON.stringify(data) }).then(data => data.json())
        .then((result: { status: string; }) => {
          if (result.status == "patient added") {
            setIsSubmitting(false);
            toast({
              title: "Data received.",
              description: "We've created a patient account for you.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            void router.push('/')
              //if user was added successfully sign up with new use and redirect to new-user page
              ;
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
        }).catch(err => console.error(err))

    }

  }



  if (isClinician) {
    return (
      <div className="grid h-screen w-screen grid-cols-1 bg-[#F9F9F9] p-2 font-manrope sm:grid-cols-2">
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>

              </AlertDialogHeader>

              <AlertDialogBody>
                Are you a clinician?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={() => {
                  setIsClinician(false)
                  onClose()
                }}>
                  No
                </Button>
                <Button colorScheme='red' onClick={() => {
                  setIsClinician(true)
                  onClose()
                }} ml={3}>
                  yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Head>
          <title>Hospital CRM</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

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
                <FormErrorMessage>
                  {errors?.firstName?.message}
                </FormErrorMessage>
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
                <FormErrorMessage>
                  {errors?.lastName?.message}
                </FormErrorMessage>
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
                        }
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
                      }
                    )}
                  </Select>
                  <Input
                    id="name"
                    className="join-item"
                    placeholder="phoneNumber"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                    })}
                    onChange={(e) => {
                      setPhoneNumber(areaCode + e.target.value);
                    }}
                  />
                </div>
                <FormErrorMessage>
                  {errors?.phoneNumber?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl m={4} isInvalid={Boolean(errors.primaryAreaOfSpeciality)}>
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
    )
  } else {
    return (
      <div className="grid h-screen w-screen grid-cols-1 bg-[#F9F9F9] p-2 font-manrope sm:grid-cols-2">
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>

              </AlertDialogHeader>

              <AlertDialogBody>
                Are you a clinician?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={() => {
                  setIsClinician(false)
                  onClose()
                }}>
                  No
                </Button>
                <Button colorScheme='red' onClick={() => {
                  setIsClinician(true)
                  onClose()
                }} ml={3}>
                  yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Head>
          <title>Hospital CRM</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

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
                <FormErrorMessage>
                  {errors?.firstName?.message}
                </FormErrorMessage>
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
                <FormErrorMessage>
                  {errors?.lastName?.message}
                </FormErrorMessage>
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
                        }
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
                      }
                    )}
                  </Select>
                  <Input
                    id="name"
                    className="join-item"
                    placeholder="phoneNumber"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                    })}
                    onChange={(e) => {
                      setPhoneNumber(areaCode + e.target.value);
                    }}
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
    )


  }
}
