"udse client";
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
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "src/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
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
import { adBanner, inventory, products } from "drizzle/schema";
import Image from "next/image";
import { InventoryPurchaseItem } from "~/components/inventory-item";

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex(
        (prevIndex) => (prevIndex + 1) % (bannersQuery?.data?.length ?? 0),
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextAd = () => {
    setCurrentAdIndex(
      (prevIndex) => (prevIndex + 1) % (bannersQuery?.data?.length ?? 0),
    );
  };

  const prevAd = () => {
    setCurrentAdIndex(
      (prevIndex) =>
        (prevIndex - 1 + (bannersQuery?.data?.length ?? 0)) %
        (bannersQuery?.data?.length ?? 0),
    );
  };
  const toast = useToast();
  const topProductsQuery = useQuery({
    queryKey: ["top-products"],
    queryFn: async function () {
      try {
        const res = await fetch("/api/get-top-products");
        const data = (await res.json()) as {
          topProducts: Array<{
            inventory: typeof inventory.$inferSelect;
            products: typeof products.$inferSelect;
          }>;
        };
        console.log(data.topProducts);
        return data.topProducts;
      } catch (e) {}
      toast({
        description: "An error occured fetching the top products",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  //console.log({ session });
  if (!isClient || bannersQuery.isLoading) {
    return <Loading />;
  }
  if (isClient && bannersQuery.isFetched) {
    return (
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">Featured Ads</h2>
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
              >
                {bannersQuery?.data?.map((ad) => (
                  <div key={ad.id} className="w-full flex-shrink-0">
                    <Image
                      src={ad.imageUrl}
                      alt={`${ad.id}`}
                      width={800}
                      height={400}
                      className="h-auto w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 transform"
              onClick={prevAd}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous ad</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 transform"
              onClick={nextAd}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next ad</span>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Top Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {topProductsQuery.data?.map((item, index) => (
              <Card key={item.products.productId}>
                <CardContent className="p-4">
                  <Image
                    src={item.products.imageUrl}
                    alt={item.products.name}
                    width={200}
                    height={200}
                    className="mb-4 h-auto w-full rounded-md"
                  />
                  <h3 className="mb-2 text-lg font-semibold">
                    {item.products.name}
                  </h3>
                  <div className="mb-2 flex items-center">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />
                    <span>{2}</span>
                  </div>
                  <p className="font-bold">
                    ${item.products.averagePrice.toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  }
}
