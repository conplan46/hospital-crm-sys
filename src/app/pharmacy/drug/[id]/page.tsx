"use client";
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { Skeleton, useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { DrugPurchaseForm, IInventoryItem } from "utils/used-types";
import Loading from "~/app/loading";
import { Pill, DollarSign, Building2 } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import {
  Card,
  CardFooter,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import Image from "next/image";
import { inventory, products } from "drizzle/schema";
export default function PharmacyDrugPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DrugPurchaseForm>();
  const toast = useToast();
  console.log({ id: params?.id });
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [isClient, setIsClient] = useState(false);
  const inventoryItemQuery = useQuery({
    queryKey: [`inventory-${params.id}`],
    queryFn: async function () {
      try {
        const formData = new FormData();
        formData.append("id", params?.id);
        const res = await fetch("/api/get-inventory-item", {
          method: "POST",
          body: formData,
        });
        const data = (await res.json()) as {
          status: string;
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
  const [quantity, setQuantity] = useState(1);
  const unitPrice = 5.99;
  const totalPrice = (quantity * unitPrice).toFixed(2);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(isNaN(newQuantity) || newQuantity < 1 ? 1 : newQuantity);
  };

  const handlePurchase = () => {
    alert(`Purchase confirmed! Total: $${totalPrice}`);
    // Here you would typically handle the purchase logic, e.g., send to an API
  };
  console.log({ inventoryItemQuery });
  const onSubmit: SubmitHandler<DrugPurchaseForm> = async (data) => {
    console.log(data);
  };
  if (!isClient) {
    return <Loading />;
  }
  return (
    <Skeleton isLoaded={inventoryItemQuery?.isFetched}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-3xl p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Purchase {inventoryItemQuery?.data?.[0]?.products?.name}
              </CardTitle>
              <Badge variant="secondary">Over-the-Counter</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <div className="relative mb-4 aspect-square">
                    <Image
                      src={
                        inventoryItemQuery?.data?.[0]?.products?.imageUrl ?? ""
                      }
                      alt={inventoryItemQuery?.data?.[0]?.products?.name ?? ""}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Drug Summary</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {inventoryItemQuery?.data?.[0]?.products?.description}
                  </p>
                  <div className="flex items-center">
                    {inventoryItemQuery?.data?.[0]?.products?.dosage?.map(
                      (dosage, index) => {
                        return (
                          <>
                            <Pill className="mr-2 h-4 w-4 text-primary" />
                            <span className="text-sm">Dosage:{dosage}</span>
                          </>
                        );
                      },
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold">
                    Purchase Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="quantity">
                        Quantity (100 tablets per bottle)
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Unit Price:</span>
                      <span>${unitPrice.toFixed(2)} per bottle</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total Price:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePurchase} className="w-full">
                <DollarSign className="mr-2 h-4 w-4" /> Purchase Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Skeleton>
  );
}
