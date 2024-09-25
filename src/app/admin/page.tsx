"use client";
import { Card, CardContent } from "src/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "src/components/ui/carousel";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  StatHelpText,
  StatArrow,
  StatGroup,
  Wrap,
  WrapItem,
  Skeleton,
  Center,
  Button,
} from "@chakra-ui/react";
import {
  CircularProgress,
  CircularProgressLabel,
  Stat,
  StatLabel,
  StatNumber,
  useToast,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "../loading";
import { z } from "zod";
import { BannerForm } from "utils/used-types";
import { SubmitHandler, useForm } from "react-hook-form";
import storage from "utils/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { adBanner } from "drizzle/schema";
import Image from "next/image";
export default function AdminPage() {
  const callBackUrl = usePathname();
  const queryClient = useQueryClient();
  const bannersQuery = useQuery({
    queryKey: ["banners"],
    queryFn: async function () {
      try {
        const res = await fetch("/api/get-banners");
        const data = (await res.json()) as {
          status: string;
          banners: Array<typeof adBanner.$inferSelect>;
        };
        console.log({ bannersfetch: data });
        return data?.banners;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching the banners",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BannerForm>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: callBackUrl });
  }
  const [isClient, setIsClient] = useState(false);
  const [demoStats, setDemoStats] = useState<{
    status: string;
    doctorCount: string;
    clinicsCount: string;
    clinicianCount: string;
    pharmaciesCount: string;
  }>();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<BannerForm> = async (data) => {
    setIsSubmitting(true);
    const storageRef = ref(storage, `banners/${data?.banner?.[0]?.name}`);

    const snapshot = await uploadBytes(storageRef, data?.banner?.[0] as Blob);
    const url = await getDownloadURL(snapshot.ref);
    if (!url) {
      toast({
        description: "Error uploading practicing license",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      const formData = new FormData();
      formData.append("banner", url);
      fetch("/api/create-banner", { method: "POST", body: formData })
        .then((data) => data.json())
        .then(
          (result: {
            status:
              | "banner added"
              | "An internal error adding the banner"
              | "An internal error occured";
          }) => {
            setIsSubmitting(false);
            if (result.status == "banner added") {
              setIsSubmitting(false);

              void queryClient.invalidateQueries({ queryKey: ["banners"] });
              toast({
                title: "Data received.",
                description: "We've created the banner",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
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
          },
        )
        .catch((err) => console.error(err));
    }
  };
  useEffect(() => {
    setIsClient(true);
    setLoading(true);
    fetch("/api/get-demographic-stats", {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    })
      .then((data) => data.json())
      .then(
        (data: {
          status: string;
          doctorCount: string;
          clinicsCount: string;
          clinicianCount: string;
          pharmaciesCount: string;
        }) => {
          setDemoStats(data);
          console.log(data);
        },
      )
      .catch((err) => {
        toast({
          status: "error",
          description: "An error occured fetching data",
        });
        console.error(err);
      });
    setLoading(false);
  }, []);
  console.log({ session });
  if (status == "loading") {
    return <Loading />;
  }
  if (status === "authenticated" && isClient) {
    return (
      <Suspense fallback={<Loading />}>
        <Modal onClose={onClose} size="full" isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Ads panel</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="btn btn-ghost text-xl">Add Banner</h1>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="form-control m-4"
              >
                <FormControl m={4} isInvalid={Boolean(errors.banner)}>
                  <FormLabel className="font-bold text-black" htmlFor="name">
                    Banner image
                  </FormLabel>
                  <input
                    {...register("banner", {
                      required: "banner is required",
                    })}
                    type="file"
                    className="file-input file-input-bordered w-full max-w-xs"
                  />

                  <FormErrorMessage>{errors?.banner?.message}</FormErrorMessage>
                </FormControl>

                <Button type="submit" isLoading={isSubmitting}>
                  Submit
                </Button>
              </form>
              <h1 className="btn btn-ghost text-xl">Current Banners</h1>
              <Carousel className="ml-5 w-full max-w-xs">
                {bannersQuery?.data?.length != 0 ? (
                  <>
                    <CarouselContent>
                      {bannersQuery?.data?.map((banner, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                  <Image fill={true} src={banner?.imageUrl} alt="banner" />

                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                ) : (
                  <span className="m-4 text-xl">no banners</span>
                )}
              </Carousel>
            </ModalBody>
            <ModalFooter>
              <Button
                size="md"
                className="btn"
                isLoading={isSubmitting}
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <main className="p-4">
          <Skeleton isLoaded={!loading}>
            <Center className="flex flex-col">
              <h1 className="btn btn-ghost text-xl">Admin Dashboard</h1>
              <Wrap>
                <WrapItem>
                  <Stat className="m-2 rounded-lg border-2 p-2">
                    <StatLabel>Doctors</StatLabel>
                    <StatNumber>{demoStats?.doctorCount}</StatNumber>
                  </Stat>
                </WrapItem>

                <WrapItem>
                  <Stat className="m-2 rounded-lg border-2 p-2">
                    <StatLabel>Pharmacies</StatLabel>{" "}
                    <StatNumber>{demoStats?.pharmaciesCount}</StatNumber>
                  </Stat>
                </WrapItem>

                <WrapItem>
                  <Stat className="m-2 rounded-lg border-2 p-2">
                    <StatLabel>Clinics</StatLabel>{" "}
                    <StatNumber>{demoStats?.clinicsCount}</StatNumber>
                  </Stat>
                </WrapItem>

                <WrapItem>
                  <Stat className="m-2 rounded-lg border-2 p-2">
                    <StatLabel>Clinicians</StatLabel>{" "}
                    <StatNumber>{demoStats?.clinicianCount}</StatNumber>
                  </Stat>
                </WrapItem>
              </Wrap>
            </Center>
            <Wrap className="flex items-center justify-center">
              <div className="border-grey mt-6 rounded-3xl border-x border-y bg-white p-6">
                <div className="m-2 flex justify-between">
                  <h1 className="default-font m-2 text-4xl text-black">
                    Manage Doctors
                  </h1>
                </div>{" "}
                <Link
                  target="_blank"
                  href="/admin/doctors"
                  className="default-font btn btn-outline ml-4 mt-4"
                >
                  head in
                </Link>
              </div>
              <div className="border-grey mt-6 rounded-3xl border-x border-y bg-white p-6">
                <div className="m-2 flex justify-between">
                  <h1 className="default-font m-2 text-4xl text-black">
                    Manage Clinicians
                  </h1>
                </div>{" "}
                <Link
                  target="_blank"
                  href="/admin/clinicians"
                  className="default-font btn btn-outline ml-4 mt-4"
                >
                  head in
                </Link>
              </div>
              <div className="border-grey mt-6 rounded-3xl border-x border-y bg-white p-6">
                <div className="m-2 flex justify-between">
                  <h1 className="default-font m-2 text-4xl text-black">
                    Manage Clinics
                  </h1>
                </div>{" "}
                <Link
                  target="_blank"
                  href="/admin/clinics"
                  className=" default-font btn btn-outline ml-4 mt-4"
                >
                  head in
                </Link>
              </div>

              <div className="border-grey mt-6 rounded-3xl border-x border-y bg-white p-6">
                <div className="m-2 flex justify-between">
                  <h1 className="default-font m-2 text-4xl text-black">
                    Manage Pharmacies
                  </h1>
                </div>{" "}
                <Link
                  target="_blank"
                  href="/admin/pharmacies"
                  className="default-font btn btn-outline ml-4 mt-4"
                >
                  head in
                </Link>
              </div>
              <div className="border-grey mt-6 rounded-3xl border-x border-y bg-white p-6">
                <div className="m-2 flex justify-between">
                  <h1 className="default-font m-2 text-4xl text-black">
                    Manage Ads
                  </h1>
                </div>{" "}
                <Button
                  onClick={() => {
                    onOpen();
                  }}
                  className=" default-font btn btn-outline ml-4 mt-4"
                >
                  head in
                </Button>
              </div>
            </Wrap>
          </Skeleton>
        </main>
      </Suspense>
    );
  }
}
