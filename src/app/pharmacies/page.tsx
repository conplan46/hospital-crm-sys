"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { Badge } from "~/components/ui/badge";
import { MapPin, Clock, Phone, Star } from "lucide-react";

import {
  Button,
  Heading,
  ListItem,
  Skeleton,
  Stack,
  Text,
  UnorderedList,
  Wrap,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Clinic, type Clinician, type Pharmacy } from "utils/used-types";
import Loading from "../loading";
import placeholder from "../../../public/depositphotos_510753268-stock-illustration-hospital-web-icon-simple-illustration.jpg";
import Image from "next/image";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { pharmacy } from "drizzle/schema";

export default function PharmacyPage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsClient(true);
  }, []);
  const toast = useToast();
  const pharmacyQuery = useQuery({
    queryKey: ["pharmacies"],
    queryFn: async function () {
      try {
        const res = await fetch("/api/get-verified-pharmacies");
        const data = (await res.json()) as {
          status: string;
          pharmacies: Array<typeof pharmacy.$inferSelect>;
        };
        return data?.pharmacies;
      } catch (e) {
        console.error(e);
        toast({
          description: "An error occured fetching Verified Pharmacies",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });
  console.log({ pharmacyQuery });

  if (!isClient) {
    return <Loading />;
  }
  if (isClient) {
    return (
      <Skeleton
        className="h-screen w-screen"
        isLoaded={pharmacyQuery?.isFetched}
      >
        {pharmacyQuery?.data?.length ?? new Array<Pharmacy>().length > 0 ? (
          <Heading size="mb" m={6}>
            Registered Pharmacies
          </Heading>
        ) : (
          <Heading size="mb" m={6}>
            No Pharmacies to show
          </Heading>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pharmacyQuery?.data?.map((pharmacy, index) => {
            return (
              <>
                <PharmacyComponent
                  key={index}
                  router={router}
                  id={pharmacy?.id}
                  name={pharmacy?.estname}
                  isOpen={true}
                  rating={0}
                  location={pharmacy?.location}
                  hours={"0800-1200"}
                  phone={pharmacy?.phonenumber}
                />
              </>
            );
          })}
        </div>
      </Skeleton>
    );
  }
}
function PharmacyComponent({
  name,
  id,
  router,
  location,
  isOpen,
  hours,
  phone,
  rating,
}: {
  name: string;
  id: number;
  router: AppRouterInstance;
  isOpen: boolean;
  location: string;
  hours: string;
  phone: string;
  rating: number;
}) {
  return (
    <Card className="m-2" key={id}>
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <span>{name}</span>
          <Badge variant={isOpen ? "default" : "destructive"}>
            {isOpen ? "Open" : "Closed"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-start">
            <MapPin className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            <span>{hours}</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <Button
            onClick={() => {
              void router.push(`/pharmacy/${id}`);
            }}
            variant="outline"
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
