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
  Box,
  CircularProgress,
  CircularProgressLabel,
  Stat,
  StatLabel,
  StatNumber,
  Wrap,
  WrapItem,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { atom } from "jotai";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import PatientsBooking from "~/components/patient-booking";
import { useQuery } from "@tanstack/react-query";
import { adBanner } from "drizzle/schema";
import Image from "next/image";
import { InventoryPurchaseItem } from "~/components/inventory-item";

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toast = useToast();
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  //console.log({ session });
  if (!isClient || bannersQuery.isLoading) {
    return <Loading />;
  }
  if (isClient && bannersQuery.isFetched) {
    return (
      <div className="flex w-screen flex-col items-center">
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {bannersQuery?.data?.map((banner, index) => (
              <CarouselItem key={index} className="basis-full">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square  items-center justify-center p-6">
                      <Image
                        src={banner?.imageUrl}
                        //className="w-{600} h-{600}"
                        width={600}
                        height={600}
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
        </Carousel>
        <div className="m-3">
          <h1 className="btn btn-ghost text-xl">Top products</h1>
          <Wrap>
            <WrapItem>
              <InventoryPurchaseItem
                id={5}
                title={"Drug 1"}
                description={"some description"}
                invCount={"7"}
              />
            </WrapItem>
            <WrapItem>
              <InventoryPurchaseItem
                id={5}
                title={"Drug 1"}
                description={"some description"}
                invCount={"7"}
              />
            </WrapItem>
            <WrapItem>
              <InventoryPurchaseItem
                id={5}
                title={"Drug 1"}
                description={"some description"}
                invCount={"7"}
              />
            </WrapItem>
          </Wrap>
        </div>
      </div>
    );
  }
}
