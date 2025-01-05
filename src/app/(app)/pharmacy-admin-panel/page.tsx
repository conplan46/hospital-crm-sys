"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "src/components/ui/carousel";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button as ButtonShad } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Plus, X, ShieldCheck } from "lucide-react";
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
import {
  AddInvItem,
  BannerForm,
  clinicianswithUsersDataType,
  clinicsDataType,
  doctorsDataType,
  doctorsWithUsersDataType,
  getPharmaciesWithUsers,
  labsWithUsersDataType,
} from "utils/used-types";
import { SubmitHandler, useForm } from "react-hook-form";
import storage from "utils/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adBanner,
  clinicians,
  clinics,
  doctors,
  inventory,
  labs,
  nurse,
  pharmacy,
  products,
  users,
} from "drizzle/schema";
import Image from "next/image";
import { verify } from "crypto";
export default function AdminPage() {
  const [validTill, setValidTill] = useState<Date | undefined>(undefined);

  const [openVerifyPharmacy, setOpenVerifyPharmacy] = useState(false);

  const [openVerifyDoctor, setOpenVerifyDoctor] = useState(false);

  const [openVerifyClinician, setOpenVerifyClinician] = useState(false);

  const [openVerifyNurse, setOpenVerifyNurse] = useState(false);

  const [openVerifyClinic, setOpenVerifyClinic] = useState(false);

  const verifyNurse = async (id: number, verified: boolean | null) => {
    if (verified) {
      const formData = new FormData();
      formData.append("id", `${id}`);
      formData.append("verified", `${verified}`);
      const req = await fetch("/api/verify-nurse", {
        method: "POST",
        body: formData,
      });
      const data = (await req.json()) as { status: string };
      if (data.status == "success") {
        toast({ description: "Nurse Unverified", status: "success" });
        setValidTill(undefined);
        setOpenVerifyNurse(false);
      } else {
        toast({ status: "error", description: data.status });
      }
    } else {
      if (id && validTill) {
        const formData = new FormData();
        formData.append("id", `${id}`);

        formData.append("validTill", validTill.toDateString());
        const req = await fetch("/api/verify-nurse", {
          method: "POST",
          body: formData,
        });
        const data = (await req.json()) as { status: string };
        if (data.status == "success") {
          toast({ description: "Nurse Verified", status: "success" });
          setValidTill(undefined);
          setOpenVerifyNurse(false);
        } else {
          toast({ status: "error", description: data.status });
        }
      } else {
        toast({
          status: "error",
          description: "You cannnot submit an empty valid till date",
        });
      }
    }

    void queryClient.invalidateQueries({ queryKey: ["nurses"] });
  };
  const verifyDoctor = async (id: number, verified: boolean | null) => {
    if (verified) {
      const formData = new FormData();
      formData.append("id", `${id}`);

      formData.append("verified", `${verified}`);
      const req = await fetch("/api/verify-doctor", {
        method: "POST",
        body: formData,
      });
      const data = (await req.json()) as { status: string };
      if (data.status == "success") {
        toast({ description: "Doctor Unverified", status: "success" });
        setValidTill(undefined);
        setOpenVerifyDoctor(false);
      } else {
        toast({ status: "error", description: data.status });
      }
    } else {
      if (validTill && id) {
        const formData = new FormData();
        formData.append("validTill", validTill.toDateString());
        formData.append("id", `${id}`);
        const req = await fetch("/api/verify-doctor", {
          method: "POST",
          body: formData,
        });
        const data = (await req.json()) as { status: string };
        if (data.status == "success") {
          toast({ description: "Doctor Verified", status: "success" });
          setValidTill(undefined);
          setOpenVerifyDoctor(false);
        } else {
          toast({ status: "error", description: data.status });
        }
      } else {
        toast({
          status: "error",
          description: "You cannnot submit an empty valid till date field",
        });
      }
    }

    void queryClient.invalidateQueries({ queryKey: ["doctors"] });
  };

  const verifyClinic = async (id: number, verified: boolean | null) => {
    if (verified) {
      const formData = new FormData();
      formData.append("verified", `${verified}`);
      formData.append("id", `${id}`);
      const req = await fetch("/api/verify-clinic", {
        method: "POST",
        body: formData,
      });
      const data = (await req.json()) as { status: string };
      if (data.status == "success") {
        toast({ description: "Pharmacy unVerified", status: "success" });
        setValidTill(undefined);
        setOpenVerifyPharmacy(false);
      } else {
        toast({ status: "error", description: data.status });
      }
    } else {
      if (validTill && id) {
        const formData = new FormData();
        formData.append("validTill", validTill.toDateString());
        formData.append("id", `${id}`);
        const req = await fetch("/api/verify-clinic", {
          method: "POST",
          body: formData,
        });
        const data = (await req.json()) as { status: string };
        if (data.status == "success") {
          toast({ description: "Pharmacy Verified", status: "success" });
          setValidTill(undefined);
          setOpenVerifyPharmacy(false);
        } else {
          toast({ status: "error", description: data.status });
        }
      } else {
        toast({
          status: "error",
          description: "You cannnot submit an empty valid till date field",
        });
      }
    }

    void queryClient.invalidateQueries({ queryKey: ["clinics"] });
  };

  const verifyClinician = async (id: number, verified: boolean | null) => {
    if (verified) {
      const formData = new FormData();
      formData.append("verified", `${verified}`);
      formData.append("id", `${id}`);
      const req = await fetch("/api/verify-clinician", {
        method: "POST",
        body: formData,
      });
      const data = (await req.json()) as { status: string };
      if (data.status == "success") {
        toast({ description: "Clinician Unverified", status: "success" });
        setValidTill(undefined);
        setOpenVerifyPharmacy(false);
      } else {
        toast({ status: "error", description: data.status });
      }
    } else {
      if (validTill && id) {
        const formData = new FormData();
        formData.append("validTill", validTill.toDateString());
        formData.append("id", `${id}`);
        const req = await fetch("/api/verify-clinician", {
          method: "POST",
          body: formData,
        });
        const data = (await req.json()) as { status: string };
        if (data.status == "success") {
          toast({ description: "Clinician Verified", status: "success" });
          setValidTill(undefined);
          setOpenVerifyPharmacy(false);
        } else {
          toast({ status: "error", description: data.status });
        }
      } else {
        toast({
          status: "error",
          description: "You cannnot submit an empty valid till date field",
        });
      }
    }

    void queryClient.invalidateQueries({ queryKey: ["clinicians"] });
  };

  const verifyPharmacy = async (id: number, verified: boolean | null) => {
    if (verified) {
      const formData = new FormData();
      formData.append("verified", `${verified}`);
      formData.append("id", `${id}`);
      const req = await fetch("/api/verify-pharmacy", {
        method: "POST",
        body: formData,
      });
      const data = (await req.json()) as { status: string };
      if (data.status == "success") {
        toast({ description: "Pharmacy unverified", status: "success" });
        setValidTill(undefined);
        setOpenVerifyPharmacy(false);
      } else {
        toast({ status: "error", description: data.status });
      }
    } else {
      if (validTill && id) {
        const formData = new FormData();
        formData.append("validTill", validTill.toDateString());
        formData.append("id", `${id}`);
        const req = await fetch("/api/verify-pharmacy", {
          method: "POST",
          body: formData,
        });
        const data = (await req.json()) as { status: string };
        if (data.status == "success") {
          toast({ description: "Pharmacy Verified", status: "success" });
          setValidTill(undefined);
          setOpenVerifyPharmacy(false);
        } else {
          toast({ status: "error", description: data.status });
        }
      } else {
        toast({
          status: "error",
          description: "You cannnot submit an empty valid till date field",
        });
      }
    }
    void queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
  };

  const verifyLab = async (id: number, verified: boolean | null) => {
    if (verified) {
      const formData = new FormData();
      formData.append("verified", `${verified}`);
      formData.append("id", `${id}`);
      const req = await fetch("/api/verify-lab", {
        method: "POST",
        body: formData,
      });
      const data = (await req.json()) as { status: string };
      if (data.status == "success") {
        toast({ description: "Lab unverified", status: "success" });
        setValidTill(undefined);
        setOpenVerifyPharmacy(false);
      } else {
        toast({ status: "error", description: data.status });
      }
    } else {
      if (validTill && id) {
        const formData = new FormData();
        formData.append("validTill", validTill.toDateString());
        formData.append("id", `${id}`);
        const req = await fetch("/api/verify-lab", {
          method: "POST",
          body: formData,
        });
        const data = (await req.json()) as { status: string };
        if (data.status == "success") {
          toast({ description: "Lab Verified", status: "success" });
          setValidTill(undefined);
          setOpenVerifyPharmacy(false);
        } else {
          toast({ status: "error", description: data.status });
        }
      } else {
        toast({
          status: "error",
          description: "You cannnot submit an empty valid till date field",
        });
      }
    }
    void queryClient.invalidateQueries({ queryKey: ["labs"] });
  };
  const callBackUrl = usePathname();
  const queryClient = useQueryClient();
  const [bannerFile, setBannerFile] = useState<File>();
  const [productLink, setProductLink] = useState<string>();
  const [loading, setLoading] = useState(false);
  const handlePromoteProduct = async (
    invId: number,
    estId: number,
    promoted: boolean | null,
  ) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("estId", `${estId}`);
      formData.append("invId", `${invId}`);

      if (!promoted) {
        const res = await fetch("/api/promote-product", {
          method: "POST",
          body: formData,
        });
        const data = (await res.json()) as { status: string };
        setLoading(false);
        if (data.status == "Product promoted") {
          toast({
            description: "Product promotion succesful",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            description: data.status,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      } else {
        const res = await fetch("/api/unpromote-product", {
          method: "POST",
          body: formData,
        });
        const data = (await res.json()) as { status: string };

        setLoading(false);
        if (data.status == "Product unpromoted") {
          toast({
            description: data.status,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            description: data.status,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }
      void queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
    } catch (e) {
      console.error(e);
      toast({
        description: "An error occured fetching the inventory",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  const adminInventoryQuery = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: async function () {
      try {
        const res = await fetch("/api/get-admin-inventory", {
          method: "GET",
        });
        const data = (await res.json()) as {
          status: string | undefined;
          inventory: Array<{
            inventory: typeof inventory.$inferSelect;
            products: typeof products.$inferSelect;
          }>;
        };
        return data.inventory;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching the inventory",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });
  const doctorsQuery = useQuery({
    queryKey: ["doctors"],
    queryFn: async function () {
      try {
        const req = await fetch("/api/get-doctors", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = (await req.json()) as {
          doctors: Array<doctorsWithUsersDataType>;
        };
        console.log({ data });
        return data;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching doctors",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });
  const nurseQuery = useQuery({
    queryKey: ["nurses"],
    queryFn: async function () {
      try {
        const req = await fetch("/api/get-nurses", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = (await req.json()) as {
          nurses: Array<{
            nurse: typeof nurse.$inferSelect;
            users: typeof users.$inferSelect;
          }>;
        };
        console.log({ data });
        return data;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching nurses",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

  const pharmaciesQuery = useQuery({
    queryKey: ["pharmacies"],
    queryFn: async function () {
      try {
        const req = await fetch("/api/get-pharmacies", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = (await req.json()) as {
          pharmacies: Array<getPharmaciesWithUsers>;
        };
        console.log({ pharmacies: data });
        return data;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching pharmacies",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });
  const clinicsQuery = useQuery({
    queryKey: ["clinics"],
    queryFn: async function () {
      try {
        const req = await fetch("/api/get-clinics", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = (await req.json()) as {
          clinics: Array<clinicsDataType>;
        };
        console.log({ data });
        return data;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching clinics",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

  const cliniciansQuery = useQuery({
    queryKey: ["clinicians"],
    queryFn: async function () {
      try {
        const req = await fetch("/api/get-clinicians", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = (await req.json()) as {
          clinicians: Array<clinicianswithUsersDataType>;
        };
        console.log({ clinicians: data });
        return data;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching clinics",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

  const labsQuery = useQuery({
    queryKey: ["labs"],
    queryFn: async function () {
      try {
        const req = await fetch("/api/get-labs", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = (await req.json()) as {
          labs: Array<labsWithUsersDataType>;
        };
        console.log({ data });
        return data;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching labs",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

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

  const {
    isOpen: isOpenProductComp,
    onOpen: onOpenProductComp,
    onClose: onCloseProductComp,
  } = useDisclosure();
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [demoStats, setDemoStats] = useState<{
    status: string;
    doctorCount: string;
    clinicsCount: string;
    clinicianCount: string;
    pharmaciesCount: string;
  }>();
  const toast = useToast();

  const onSubmitBanner: SubmitHandler<BannerForm> = async () => {
    setIsSubmitting(true);
    const storageRef = ref(storage, `banners/${bannerFile?.name}`);

    const snapshot = await uploadBytes(storageRef, bannerFile as Blob);
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
      formData.append("productLink", productLink ?? "");
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
  }, []);
  console.log({ session });
  if (status == "loading") {
    return <Loading />;
  }
  if (status === "authenticated" && isClient) {
    return (
      <Suspense fallback={<Loading />}>
        <AddProductComponent
          isOpenProductComp={isOpenProductComp}
          onOpenProductComp={onOpenProductComp}
          onCloseProductComp={onCloseProductComp}
        />
        <Modal onClose={onClose} size="full" isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Ads panel</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h1 className="btn btn-ghost text-xl">Add Banner</h1>
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
                                <Image
                                  fill={true}
                                  src={banner?.imageUrl}
                                  alt="banner"
                                />
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

        <div className="container mx-auto p-4">
          <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
          <Tabs defaultValue="doctors">
            <TabsList className="my-8 grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="doctors">Doctors</TabsTrigger>

              <TabsTrigger value="nurses">Nurses</TabsTrigger>
              <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
              <TabsTrigger value="clinics">Clinics</TabsTrigger>
              <TabsTrigger value="clinicians">Clinicians</TabsTrigger>
              <TabsTrigger value="labs">Labs</TabsTrigger>
              <TabsTrigger
                onClick={() => {
                  onOpenProductComp();
                }}
                value="products"
              >
                Products
              </TabsTrigger>
              <TabsTrigger value="promote">Promote</TabsTrigger>
              <TabsTrigger value="adbanners">Ad Banners</TabsTrigger>
            </TabsList>
            <TabsContent className="m-4" value="doctors">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Doctors</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>

                        <TableHead>Location</TableHead>

                        <TableHead>Verify</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctorsQuery?.data?.doctors?.map((doctor, index) => {
                        return (
                          <TableRow key={doctor.id}>
                            <TableCell>{`${doctor.firstname} ${doctor.lastname}`}</TableCell>
                            <TableCell>{doctor.users?.email}</TableCell>
                            <TableCell>{doctor.phonenumber}</TableCell>
                            <TableCell>{doctor.countyofpractice}</TableCell>
                            <TableCell>
                              {doctor.primaryareaofspeciality}
                            </TableCell>
                            <TableCell>
                              <Dialog
                                open={openVerifyDoctor}
                                onOpenChange={setOpenVerifyDoctor}
                              >
                                <DialogTrigger asChild>
                                  <ButtonShad>
                                    <ShieldCheck className="mr-2 h-4 w-4" />{" "}
                                    {doctor?.verified ? "Unverify" : "Verified"}
                                  </ButtonShad>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Set Valid Until Date
                                    </DialogTitle>
                                    <DialogDescription>
                                      Please visit the website at{" "}
                                      <a
                                        href="https://osp.nckenya.com/LicenseStatus"
                                        target="_blank"
                                        className="text-primary hover:underline"
                                      >
                                        NCK Register
                                      </a>{" "}
                                      search {doctor?.practice_license_number}{" "}
                                      and click view details and check if the
                                      following details and correspond to the
                                      user information and fill the in the valid
                                      date in the field below with the valid
                                      until date.
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Name</TableHead>

                                            <TableHead>Location</TableHead>

                                            <TableHead>
                                              License Number
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          <TableRow key={doctor?.id}>
                                            <TableCell>{`${doctor?.firstname} ${doctor.lastname}`}</TableCell>

                                            <TableCell>
                                              {doctor.countyofpractice}
                                            </TableCell>
                                            <TableCell>
                                              {doctor.practice_license_number}
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div>
                                    <Input
                                      type="date"
                                      onChange={(e) => {
                                        setValidTill(
                                          e?.target?.valueAsDate ?? undefined,
                                        );
                                      }}
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        void verifyDoctor(
                                          doctor?.id,
                                          doctor?.verified,
                                        );
                                      }}
                                    >
                                      {doctor?.verified ? "Unveriy" : "Verify"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>{" "}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className="m-4" value="nurses">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Nurses</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Number</TableHead>
                        <TableHead>License Number</TableHead>
                        <TableHead>Verify</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nurseQuery?.data?.nurses?.map((nurse, index) => {
                        return (
                          <TableRow key={nurse.nurse.id}>
                            <TableCell>{`${nurse.nurse.firstname} ${nurse.nurse.lastname}`}</TableCell>
                            <TableCell>{nurse.users.email}</TableCell>
                            <TableCell>{nurse.nurse.phonenumber}</TableCell>

                            <TableCell>
                              {nurse.nurse.countyofpractice}
                            </TableCell>

                            <TableCell>
                              <Dialog
                                open={openVerifyNurse}
                                onOpenChange={setOpenVerifyNurse}
                              >
                                <DialogTrigger asChild>
                                  <ButtonShad>
                                    <ShieldCheck className="mr-2 h-4 w-4" />{" "}
                                    {nurse?.nurse?.verified
                                      ? "Unverify"
                                      : "Verify"}
                                  </ButtonShad>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Set Valid Until Date
                                    </DialogTitle>
                                    <DialogDescription>
                                      Please visit the website at{" "}
                                      <a
                                        href="https://osp.nckenya.com/LicenseStatus"
                                        target="_blank"
                                        className="text-primary hover:underline"
                                      >
                                        NCK Register
                                      </a>{" "}
                                      search{" "}
                                      {nurse?.nurse?.practiceLicenseNumber} and
                                      click view details and check if the
                                      following details and correspond to the
                                      user information and fill the in the valid
                                      date in the field below with the valid
                                      until date.
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Name</TableHead>

                                            <TableHead>Location</TableHead>

                                            <TableHead>
                                              License Number
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          <TableRow key={nurse.nurse.id}>
                                            <TableCell>{`${nurse.nurse.firstname} ${nurse.nurse.lastname}`}</TableCell>

                                            <TableCell>
                                              {nurse.nurse.countyofpractice}
                                            </TableCell>
                                            <TableCell>
                                              {
                                                nurse.nurse
                                                  .practiceLicenseNumber
                                              }
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div>
                                    <Input
                                      type="date"
                                      onChange={(e) => {
                                        setValidTill(
                                          e?.target?.valueAsDate ?? undefined,
                                        );
                                      }}
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        void verifyNurse(
                                          nurse?.nurse?.id,
                                          nurse?.nurse?.verified,
                                        );
                                      }}
                                    >
                                      Verify
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pharmacies">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Pharmacies</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Establishment Id</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>

                        <TableHead>Phone Number</TableHead>

                        <TableHead>Location</TableHead>

                        <TableHead>Facility Registration Number</TableHead>
                        <TableHead>License Number</TableHead>

                        <TableHead>Verify</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pharmaciesQuery?.data?.pharmacies?.map(
                        (pharmacy, index) => {
                          return (
                            <TableRow key={pharmacy?.id}>
                              <TableCell>{pharmacy?.id}</TableCell>
                              <TableCell>{}</TableCell>
                              <TableCell>{pharmacy?.estname}</TableCell>
                              <TableCell>{pharmacy?.phonenumber}</TableCell>

                              <TableCell>{pharmacy?.location}</TableCell>
                              <TableCell>
                                {pharmacy?.facility_registration_number}
                              </TableCell>
                              <TableCell>{pharmacy?.license_number}</TableCell>

                              <TableCell>
                                <Dialog
                                  open={openVerifyPharmacy}
                                  onOpenChange={setOpenVerifyPharmacy}
                                >
                                  <DialogTrigger asChild>
                                    <ButtonShad>
                                      <ShieldCheck className="mr-2 h-4 w-4" />{" "}
                                      {pharmacy?.verified
                                        ? "Unverify"
                                        : "Verify"}
                                    </ButtonShad>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    {pharmacy?.verified ? (
                                      ""
                                    ) : (
                                      <>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Set Valid Until Date
                                          </DialogTitle>
                                          <DialogDescription>
                                            Please visit the website at{" "}
                                            <a
                                              href="https://practice.pharmacyboardkenya.org/LicenseStatus?register=facilities&ftype=retail"
                                              target="_blank"
                                              className="text-primary hover:underline"
                                            >
                                              Pharmacy Board kenya
                                            </a>{" "}
                                            search{" "}
                                            {
                                              pharmacy?.facility_registration_number
                                            }{" "}
                                            and click view details and check if
                                            the following details and correspond
                                            to the user information and fill the
                                            in the valid date in the field below
                                            with the valid until date.
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead>Name</TableHead>

                                                  <TableHead>
                                                    Location
                                                  </TableHead>

                                                  <TableHead>
                                                    Facility Registration Number
                                                  </TableHead>
                                                  <TableHead>
                                                    License Number
                                                  </TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                <TableRow key={pharmacy?.id}>
                                                  <TableCell>
                                                    {pharmacy.estname}
                                                  </TableCell>

                                                  <TableCell>
                                                    {pharmacy.location}
                                                  </TableCell>
                                                  <TableCell>
                                                    {
                                                      pharmacy.facility_registration_number
                                                    }
                                                  </TableCell>
                                                  <TableCell>
                                                    {pharmacy.license_number}
                                                  </TableCell>
                                                </TableRow>
                                              </TableBody>
                                            </Table>
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div>
                                          <Input
                                            type="date"
                                            onChange={(e) => {
                                              setValidTill(
                                                e?.target?.valueAsDate ??
                                                  undefined,
                                              );
                                            }}
                                          />
                                        </div>
                                      </>
                                    )}
                                    <DialogFooter>
                                      <Button
                                        onClick={() => {
                                          void verifyPharmacy(
                                            pharmacy?.id,
                                            pharmacy?.verified,
                                          );
                                        }}
                                      >
                                        {pharmacy?.verified
                                          ? "Unverify"
                                          : "Verify"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          );
                        },
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="clinics">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Clinics</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>

                        <TableHead>Location</TableHead>
                        <TableHead>Verify</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinicsQuery?.data?.clinics?.map((clinic, index) => {
                        return (
                          <TableRow key={clinic.id}>
                            <TableCell>{clinic.estname}</TableCell>
                            <TableCell>{clinic.phonenumber}</TableCell>

                            <TableCell>{clinic.location}</TableCell>
                            <TableCell>
                              <Dialog
                                open={openVerifyClinic}
                                onOpenChange={setOpenVerifyClinic}
                              >
                                <DialogTrigger asChild>
                                  <ButtonShad>
                                    <ShieldCheck className="mr-2 h-4 w-4" />{" "}
                                    Verify
                                  </ButtonShad>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Set Valid Until Date
                                    </DialogTitle>
                                    <DialogDescription>
                                      Please visit the website at{" "}
                                      <a
                                        href="https://practice.pharmacyboardkenya.org/LicenseStatus?register=facilities&ftype=retail"
                                        target="_blank"
                                        className="text-primary hover:underline"
                                      >
                                        Pharmacy Board kenya
                                      </a>{" "}
                                      search {clinic?.practice_license_number}{" "}
                                      and click view details and check if the
                                      following details and correspond to the
                                      user information and fill the in the valid
                                      date in the field below with the valid
                                      until date.
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Name</TableHead>

                                            <TableHead>Location</TableHead>

                                            <TableHead>
                                              License Number
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          <TableRow key={clinic.id}>
                                            <TableCell>
                                              {clinic.estname}
                                            </TableCell>

                                            <TableCell>
                                              {clinic?.location}
                                            </TableCell>
                                            <TableCell>
                                              {clinic?.practice_license_number}
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div>
                                    <Input
                                      type="date"
                                      onChange={(e) => {
                                        setValidTill(
                                          e?.target?.valueAsDate ?? undefined,
                                        );
                                      }}
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        void verifyClinic(
                                          clinic?.id,
                                          clinic?.verified,
                                        );
                                      }}
                                    >
                                      {clinic?.verified ? "Unverify" : "Verify"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="clinicians">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Clinicians</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Location</TableHead>

                        <TableHead>Primary Area of Speciality</TableHead>
                        <TableHead>Verify</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cliniciansQuery?.data?.clinicians?.map(
                        (clinician, index) => {
                          return (
                            <TableRow key={clinician?.id}>
                              <TableCell>{`${clinician?.firstname} ${clinician?.lastname}`}</TableCell>
                              <TableCell>
                                {clinician?.phonenumber}
                              </TableCell>
                              <TableCell>{clinician?.users?.email}</TableCell>
                              <TableCell>
                                {clinician?.countyofpractice}
                              </TableCell>

                              <TableCell>
                                {clinician?.primaryareaofspeciality}
                              </TableCell>
                              <TableCell>
                                <Dialog
                                  open={openVerifyClinician}
                                  onOpenChange={setOpenVerifyClinician}
                                >
                                  <DialogTrigger asChild>
                                    <ButtonShad>
                                      <ShieldCheck className="mr-2 h-4 w-4" />{" "}
                                      {clinician?.verified
                                        ? "Unverify"
                                        : "Verify"}
                                    </ButtonShad>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    {clinician?.verified ? (
                                      ""
                                    ) : (
                                      <>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Set Valid Until Date
                                          </DialogTitle>
                                          <DialogDescription>
                                            Please visit the website at{" "}
                                            <a
                                              href="https://portal.clinicalofficerscouncil.org/LicenseStatus"
                                              target="_blank"
                                              className="text-primary hover:underline"
                                            >
                                              Clinical Officer Registry
                                            </a>{" "}
                                            search{" "}
                                            {
                                              clinician?.practiceLicenseNumber
                                            }{" "}
                                            and click view details and check if
                                            the following details and correspond
                                            to the user information and fill the
                                            in the valid date in the field below
                                            with the valid until date.
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead>Name</TableHead>

                                                  <TableHead>
                                                    Location
                                                  </TableHead>

                                                  <TableHead>
                                                    License Number
                                                  </TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                <TableRow
                                                  key={clinician?.id}
                                                >
                                                  <TableCell>
                                                    {`${clinician?.firstname} ${clinician?.lastname}`}
                                                  </TableCell>

                                                  <TableCell>
                                                    {
                                                      clinician?.countyofpractice
                                                    }
                                                  </TableCell>
                                                  <TableCell>
                                                    {
                                                      clinician?.practiceLicenseNumber
                                                    }
                                                  </TableCell>
                                                </TableRow>
                                              </TableBody>
                                            </Table>
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div>
                                          <Input
                                            type="date"
                                            onChange={(e) => {
                                              setValidTill(
                                                e?.target?.valueAsDate ??
                                                  undefined,
                                              );
                                            }}
                                          />
                                        </div>
                                      </>
                                    )}
                                    <DialogFooter>
                                      <Button
                                        onClick={() => {
                                          void verifyClinician(
                                            clinician?.id,
                                            clinician?.verified,
                                          );
                                        }}
                                      >
                                        {clinician?.verified
                                          ? "Unverify"
                                          : "Verify"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          );
                        },
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="labs">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Labs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labsQuery?.data?.labs?.map((lab, index) => {
                        return (
                          <TableRow key={lab?.id}>
                            <TableCell>{lab?.estname}</TableCell>
                            <TableCell>{lab?.phonenumber}</TableCell>
                            <TableCell>{lab?.users?.email}</TableCell>
                            <TableCell>{lab?.location}</TableCell>
                            <TableCell>
                              <Dialog
                                open={openVerifyClinician}
                                onOpenChange={setOpenVerifyClinician}
                              >
                                <DialogTrigger asChild>
                                  <ButtonShad>
                                    <ShieldCheck className="mr-2 h-4 w-4" />{" "}
                                    {lab?.verified
                                      ? "Unverify"
                                      : "Verify"}
                                  </ButtonShad>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {lab?.verified ?"Unverify": "Set Valid Until Date"}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Please visit the website at{" "}
                                      <a
                                        href="https://portal.clinicalofficerscouncil.org/LicenseStatus"
                                        target="_blank"
                                        className="text-primary hover:underline"
                                      >
                                        Clinical Officer Registry
                                      </a>{" "}
                                      search {lab?.practice_license_number}{" "}
                                      and click view details and check if the
                                      following details and correspond to the
                                      user information and fill the in the valid
                                      date in the field below with the valid
                                      until date.
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Name</TableHead>

                                            <TableHead>Location</TableHead>

                                            <TableHead>
                                              License Number
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          <TableRow key={lab?.id}>
                                            <TableCell>
                                              {lab?.estname}
                                            </TableCell>

                                            <TableCell>
                                              {lab?.location}
                                            </TableCell>
                                            <TableCell>
                                              {lab?.practice_license_number}
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div>
                                    <Input
                                      type="date"
                                      onChange={(e) => {
                                        setValidTill(
                                          e?.target?.valueAsDate ?? undefined,
                                        );
                                      }}
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        void verifyLab(
                                          lab?.id,
                                          lab?.verified,
                                        );
                                      }}
                                    >
                                      {lab?.verified
                                        ? "Unverify"
                                        : "Verify"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="products"></TabsContent>
            <TabsContent value="promote">
              <Card>
                <CardHeader>
                  <CardTitle>Promote Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>

                        <TableHead>Establishment Id</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminInventoryQuery?.data?.map((inv, index) => (
                        <TableRow key={inv?.inventory?.id}>
                          <TableCell>{inv?.products?.name}</TableCell>

                          <TableCell>{inv?.inventory?.estId}</TableCell>
                          <TableCell>{inv?.products?.description}</TableCell>
                          <TableCell>
                            ${inv?.inventory?.price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {inv?.inventory?.topProduct
                              ? "Promoted"
                              : "Not Promoted"}
                          </TableCell>
                          <TableCell>
                            <Button
                              isLoading={loading}
                              onClick={() =>
                                handlePromoteProduct(
                                  inv?.inventory.id,
                                  inv?.inventory?.estId,
                                  inv?.inventory?.topProduct ?? false,
                                )
                              }
                            >
                              {inv?.inventory?.topProduct
                                ? "Unpromote"
                                : "Promote"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="adbanners">
              <Card>
                <CardHeader>
                  <CardTitle>Ad Banners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {bannersQuery?.data?.map((banner) => (
                      <div
                        key={banner.id}
                        className="flex items-center space-x-4"
                      >
                        <img
                          src={banner.imageUrl}
                          alt={"banner"}
                          className="h-16 w-32 rounded object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{}</h3>
                          <p className="text-sm text-muted-foreground">
                            Link: {banner.productLink}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <h3 className="mb-2 text-lg font-semibold">
                      Add New Ad Banner
                    </h3>
                    <form
                      onSubmit={handleSubmit(onSubmitBanner)}
                      className="form-control m-4 space-y-4"
                    >
                      <FormControl m={4} isInvalid={Boolean(errors.banner)}>
                        <Label htmlFor="bannerImage">Banner image</Label>

                        <Input
                          onChange={(e) => {
                            setBannerFile(e?.target?.files?.[0]);
                          }}
                          type="file"
                          required
                        />

                        <FormErrorMessage>
                          {errors?.banner?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl m={4} isInvalid={Boolean(errors.banner)}>
                        <Label htmlFor="productLink">Product Link</Label>
                        <Input
                          id="productLink"
                          value={productLink}
                          onChange={(e) => setProductLink(e?.target?.value)}
                          required
                        />

                        <FormErrorMessage>
                          {errors?.banner?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <Button type="submit" isLoading={isSubmitting}>
                        Add Ad Banner
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Suspense>
    );
  }
}
function AddProductComponent({
  isOpenProductComp,
  onOpenProductComp,
  onCloseProductComp,
}: {
  isOpenProductComp: boolean;
  onOpenProductComp: () => void;
  onCloseProductComp: () => void;
}) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddInvItem>();
  const onSubmit: SubmitHandler<AddInvItem> = async (data) => {
    try {
      console.log(data);
      setIsSubmitting(true);

      const formData = new FormData();

      const storageRef = ref(
        storage,
        `drug-product-images/${data?.drugImage?.[0]?.name}`,
      );

      const snapshot = await uploadBytes(
        storageRef,
        data?.drugImage?.[0] as Blob,
      );
      const url = await getDownloadURL(snapshot.ref);
      console.log(url);
      console.log(dosages);
      if (url && dosages?.length > 0) {
        formData.append("productTitle", data.productTitle);
        formData.append("productImageUrl", url);
        formData.append("productPrice", `${data.price}`);
        formData.append("productManufacturer", data.productManufacturer);
        formData.append("dosages", JSON.stringify(dosages));
        formData.append("productDescription", data.productDescription);
        fetch("/api/create-product", { method: "POST", body: formData })
          .then((data) => data.json())
          .then((data: { status: string }) => {
            if (
              data.status === "Product added to the pharmaceutuical database"
            ) {
              toast({
                description: "Item Added",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              //void queryClient.invalidateQueries({ queryKey: ["inventory"] });
            } else if (
              data.status == "product exists in the pharmaceutuical database"
            ) {
              toast({
                description: data.status,
                status: "success",
                duration: 9000,
                isClosable: true,
              });
            } else {
              toast({
                description: data.status,
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }
            setIsSubmitting(false);
          })
          .catch((err) => {
            setIsSubmitting(false);

            console.error(err);
            toast({
              description: "An error occurred",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          });
      } else {
        setIsSubmitting(false);
        toast({
          description: "An error occured upload the product image",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (e) {
      console.error(e);

      toast({
        description: "An error occurred",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  const [dosages, setDosages] = useState<string[]>([]);
  const [newDosage, setNewDosage] = useState("");

  const addDosage = () => {
    if (newDosage.trim() !== "") {
      setDosages([...dosages, newDosage.trim()]);
      setNewDosage("");
    }
  };

  const removeDosage = (index: number) => {
    setDosages(dosages.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={isOpenProductComp} onClose={onCloseProductComp}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-auto max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow"
            >
              <h2 className="mb-6 text-center text-2xl font-bold">
                Add New Product
              </h2>
              <FormControl isInvalid={Boolean(errors.drugImage)}>
                <div className="space-y-2">
                  <Label htmlFor="drugImage">Drug Product Image</Label>
                  <Input
                    {...register("drugImage", {
                      required: "drug product image is required",
                    })}
                    id="drugImage"
                    type="file"
                    accept="image/*"
                    required
                  />
                </div>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.productTitle)}>
                <div className="space-y-2">
                  <Label htmlFor="drugName">Drug Product Name</Label>
                  <Input
                    {...register("productTitle", {
                      required: "name is required",
                    })}
                    id="drugName"
                    placeholder="Enter drug name"
                    required
                  />

                  <FormErrorMessage>
                    {errors?.productTitle?.message}
                  </FormErrorMessage>
                </div>

                <FormErrorMessage>
                  {errors?.productTitle?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(errors.productDescription)}>
                <div className="space-y-2">
                  <Label htmlFor="drugDescription">
                    Drug Product Description
                  </Label>
                  <Textarea
                    {...register("productDescription", {
                      required: "description is required",
                    })}
                    id="drugDescription"
                    placeholder="Enter drug description"
                    required
                  />

                  <FormErrorMessage>
                    {errors?.productDescription?.message}
                  </FormErrorMessage>
                </div>
              </FormControl>
              <FormControl isInvalid={Boolean(errors?.productManufacturer)}>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    {...register("productManufacturer", {
                      required: "product manufacturer required",
                    })}
                    placeholder="Enter manufacturer name"
                    required
                  />
                  <FormErrorMessage>
                    {errors?.productManufacturer?.message}
                  </FormErrorMessage>
                </div>
              </FormControl>

              <div className="space-y-2">
                <Label>Dosages</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    placeholder="Enter dosage (e.g., 500mg)"
                  />
                  <ButtonShad type="button" onClick={addDosage} size="icon">
                    <Plus className="h-4 w-4" />
                  </ButtonShad>
                </div>
                <div className="mt-2 space-y-2">
                  {dosages?.map((dosage, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 rounded bg-gray-100 p-2"
                    >
                      <span>{dosage}</span>
                      <ButtonShad
                        type="button"
                        onClick={() => removeDosage(index)}
                        size="icon"
                        variant="ghost"
                      >
                        <X className="h-4 w-4" />
                      </ButtonShad>
                    </div>
                  ))}
                </div>
              </div>
              <FormControl isInvalid={Boolean(errors.price)}>
                <div className="space-y-2">
                  <Label htmlFor="averagePrice">Average Price</Label>
                  <Input
                    {...register("price", {
                      required: "price is required",
                    })}
                    id="averagePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter average price"
                    required
                  />
                  <FormErrorMessage>{errors?.price?.message}</FormErrorMessage>
                </div>
              </FormControl>

              <Button isLoading={isSubmitting} type="submit" className="w-full">
                Add Drug Product
              </Button>
            </form>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
