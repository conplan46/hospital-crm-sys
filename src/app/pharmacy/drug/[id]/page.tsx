"use client";
import { Skeleton, useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { DrugPurchaseForm, IInventoryItem } from "utils/used-types";
import Loading from "~/app/loading";

export default function PharmacyDrugPage({ params }: { params: { id: string } }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DrugPurchaseForm>();
  const toast = useToast();
  console.log({ id:params?.id });
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
          inventory: Array<IInventoryItem>;
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
        <div className="bg-gray-100 py-8 dark:bg-gray-800">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="-mx-4 flex flex-col md:flex-row">
              <div className="px-4 md:flex-1">
                <div className="mb-4 h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700">
                  <div className="skeleton h-full w-full object-cover"></div>
                </div>
                <div className="-mx-2 mb-4 flex">
                  <div className="w-1/2 px-2">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-gray-900 px-4 py-2 font-bold text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-4 md:flex-1">
                <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                  Product Name
                </h2>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  {inventoryItemQuery?.data?.[0]?.name}
                </p>
                <div className="mb-4 flex">
                  <div className="mr-4">
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      Price:
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      $29.99
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      Availability:
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {parseInt(inventoryItemQuery?.data?.[0]?.inventory_count ?? "0") > 1
                        ? <div className="badge">In stock</div>

                        : <div className="badge">Not in stock</div>
}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Select Quantity
                  </span>
                  <div className="mt-2 flex items-center">
                    <input
                      type="number"
                      {...register("quantity", {
                        required: true,
                        max: inventoryItemQuery?.data?.[0]?.inventory_count,
                      })}
                      placeholder="Type here"
                      className="input input-ghost w-full max-w-xs "
                    />
                  </div>
                </div>
                <div>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Product Description:
                  </span>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {inventoryItemQuery?.data?.[0]?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Skeleton>
  );
}
