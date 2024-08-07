"use client";
import { Center, Heading, Skeleton, Wrap, useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type Product } from "utils/used-types";
import {
  InventoryPurchaseItem,
  ProductComponent,
} from "~/components/inventory-item";
export default function PharmDbPage() {
  const [isClient, setIsClient] = useState(false);
  const toast = useToast();
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async function () {
      try {
        const res = await fetch("/api/get-products", {
          method: "GET",
        });
        const data = (await res.json()) as {
          status: string;
          products: Array<Product>;
        };
        return data.products;
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

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (isClient) {
    return (
      <>
        <div className="flex w-screen flex-col items-center justify-center">
          {productsQuery?.data?.length ?? new Array<Product>().length > 0 ? (
            <Heading size="mb" m={6}>
              Current Database
            </Heading>
          ) : (
            <Heading size="mb" m={6}>
              No items in database to show
            </Heading>
          )}
          <Skeleton
            className="h-screen w-screen"
            isLoaded={productsQuery.isFetched}
          >
            <Center>
              <Wrap>
                {productsQuery.data?.map((item, index: number) => {
                  return (
                    <ProductComponent
                      id={item.product_id}
                      key={index}
                      title={item.name}
                      description={item.description}
                    />
                  );
                })}
              </Wrap>
            </Center>
          </Skeleton>
        </div>
      </>
    );
  }
}
