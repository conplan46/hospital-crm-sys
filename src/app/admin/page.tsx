"use client";
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
import { Plus, X } from "lucide-react";
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
import { AddInvItem, BannerForm } from "utils/used-types";
import { SubmitHandler, useForm } from "react-hook-form";
import storage from "utils/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adBanner,
  clinicians,
  clinics,
  doctors,
  labs,
  pharmacy,
} from "drizzle/schema";
import Image from "next/image";
import { ADDRCONFIG } from "dns";
export default function AdminPage() {
  const callBackUrl = usePathname();
  const queryClient = useQueryClient();
  const doctorsQuery = useQuery({
    queryKey: ["doctors"],
    queryFn: async function () {
      try {
        const req = await fetch("/api/get-doctors", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = (await req.json()) as {
          status: string;
          doctors: Array<typeof doctors.$inferSelect>;
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
  const pharmaciesQuery = useQuery({
    queryKey: ["pharmacies"],
    queryFn: async function () {
      try {
        const req = await fetch("/api/get-pharmacies", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = (await req.json()) as {
          status: string;
          pharmacies: Array<typeof pharmacy.$inferSelect>;
        };
        console.log({ data });
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
          status: string;
          clinics: Array<typeof clinics.$inferSelect>;
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
          status: string;
          clinicians: Array<typeof clinicians.$inferSelect>;
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

  const labsQuery = useQuery({
    queryKey: ["labs"],
    queryFn: async function () {
      try {
        const req = await fetch("/api/get-labs", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = (await req.json()) as {
          status: string;
          labs: Array<typeof labs.$inferSelect>;
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
                    Add product
                  </h1>
                </div>{" "}
                <Button
                  className="default-font btn btn-outline ml-4 mt-4"
                  onClick={() => {
                    onOpenProductComp();
                  }}
                >
                  Add
                </Button>
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
        <div className="container mx-auto p-4">
          <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
          <Tabs defaultValue="doctors">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
              <TabsTrigger value="clinics">Clinics</TabsTrigger>
              <TabsTrigger value="clinicians">Clinicians</TabsTrigger>
              <TabsTrigger value="labs">Labs</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="promote">Promote</TabsTrigger>
              <TabsTrigger value="adbanners">Ad Banners</TabsTrigger>
            </TabsList>
            <TabsContent value="doctors">
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctorsQuery?.data?.doctors.map((doctor, index) => {
                        return (
                          <TableRow key={doctor.id}>
                            <TableCell>{`${doctor.firstname} ${doctor.lastname}`}</TableCell>
                            <TableCell>{doctor.phonenumber}</TableCell>

                            <TableCell>{doctor.countyofpractice}</TableCell>

                            <TableCell>
                              {doctor.primaryareaofspeciality}
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
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>

                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pharmaciesQuery?.data?.pharmacies.map(
                        (pharmacy, index) => {
                          return (
                            <TableRow key={pharmacy.id}>
                              <TableCell>{pharmacy.estname}</TableCell>
                              <TableCell>{pharmacy.phonenumber}</TableCell>

                              <TableCell>{pharmacy.location}</TableCell>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinicsQuery?.data?.clinics.map((clinic, index) => {
                        return (
                          <TableRow key={clinic.id}>
                            <TableCell>{clinic.estname}</TableCell>
                            <TableCell>{clinic.phonenumber}</TableCell>

                            <TableCell>{clinic.location}</TableCell>
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

                        <TableHead>Location</TableHead>

                        <TableHead>Primary Area of Speciality</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cliniciansQuery?.data?.clinicians.map(
                        (clinician, index) => {
                          return (
                            <TableRow key={clinician.id}>
                              <TableCell>{`${clinician.firstname} ${clinician.lastname}`}</TableCell>
                              <TableCell>{clinician.phonenumber}</TableCell>

                              <TableCell>
                                {clinician.countyofpractice}
                              </TableCell>

                              <TableCell>
                                {clinician.primaryareaofspeciality}
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

                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labsQuery?.data?.labs.map((lab, index) => {
                        return (
                          <TableRow key={lab.id}>
                            <TableCell>{lab?.estname}</TableCell>
                            <TableCell>{lab?.phonenumber}</TableCell>

                            <TableCell>{lab?.location}</TableCell>
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
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            {product.promoted ? "Promoted" : "Not Promoted"}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handlePromoteProduct(product.id)}
                            >
                              {product.promoted ? "Unpromote" : "Promote"}
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
                          alt={banner.title}
                          className="h-16 w-32 rounded object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{banner.title}</h3>
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
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddAdBanner();
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="bannerTitle">Title</Label>
                        <Input
                          id="bannerTitle"
                          value={newAdBanner.title}
                          onChange={(e) =>
                            setNewAdBanner({
                              ...newAdBanner,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="bannerImageUrl">Image URL</Label>
                        <Input
                          id="bannerImageUrl"
                          value={newAdBanner.imageUrl}
                          onChange={(e) =>
                            setNewAdBanner({
                              ...newAdBanner,
                              imageUrl: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="bannerLink">Link</Label>
                        <Input
                          id="bannerLink"
                          value={newAdBanner.link}
                          onChange={(e) =>
                            setNewAdBanner({
                              ...newAdBanner,
                              link: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <Button type="submit">Add Ad Banner</Button>
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
                  {dosages.map((dosage, index) => (
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
