"use client";
import { Skeleton, useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { DrugPurchaseForm, IInventoryItem } from "utils/used-types";
import Loading from "~/app/loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Pill, DollarSign, Building2 } from "lucide-react";
import Image from "next/image";
import { products } from "drizzle/schema";
export default function DrugPage({ params }: { params: { id: string } }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DrugPurchaseForm>();
  const toast = useToast();
  console.log({ params });
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [isClient, setIsClient] = useState(false);
  const productQuery = useQuery({
    queryKey: [`product-${params.id}`],
    queryFn: async function () {
      try {
        const formData = new FormData();
        formData.append("id", params.id);
        const res = await fetch("/api/get-product", {
          method: "POST",
          body: formData,
        });
        const data = (await res.json()) as {
          status: string;
          product: Array<typeof products.$inferSelect>;
        };
        return data.product;
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
  console.log({ productQuery });
  const onSubmit: SubmitHandler<DrugPurchaseForm> = async (data) => {
    console.log(data);
  };
  if (!isClient) {
    return <Loading />;
  }
  return (
    <Skeleton isLoaded={productQuery?.isFetched}>
      <div className="mx-auto max-w-2xl p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {productQuery?.data?.[0]?.name}
            </CardTitle>
            <Badge variant="secondary">Over-the-Counter</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Drug Summary</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {productQuery?.data?.[0]?.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Pill className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm">
                      dosage: {productQuery?.data?.[0]?.dosage}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Average Price: {productQuery?.data?.[0]?.averagePrice}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Manufacturer: {productQuery?.data?.[0]?.manufacturer}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Packaging</h3>
                <div className="relative aspect-square">
                  <Image
                    src={productQuery?.data?.[0]?.imageUrl as string}
                    alt="Aspirin packaging"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Skeleton>
  );
}
