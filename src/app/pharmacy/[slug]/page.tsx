"use client";
import {
  Tooltip,
  Heading,
  Wrap,
  WrapItem,
  Center,
  Button,
  useToast,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { products, inventory } from "drizzle/schema";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { AddInvItem, IInventoryItem } from "utils/used-types";
import Loading from "~/app/loading";
import {
  InventoryItem,
  InventoryPurchaseItem,
} from "~/components/inventory-item";
export default function PharmacyView({ params }: { params: { slug: string } }) {
  const [isClient, setIsClient] = useState(false);

  const { data: session, status } = useSession();

  const callBackUrl = usePathname();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddInvItem>();
  const queryClient = useQueryClient();

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const inventoryQuery = useQuery({
    queryKey: ["inventory"],
    queryFn: async function () {
      try {
        const res = await fetch("/api/get-inventory", {
          method: "POST",
          body: JSON.stringify({ estId: params.slug }),
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
  console.log({ inventoryQuery });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (status == "loading") {
    return <Loading />;
  }
  if (!isClient) {
    return <Loading />;
  }
  if (isClient) {
    return (
      <>
        <div className="flex w-screen flex-col items-center justify-center">
          {inventoryQuery?.data?.length ??
          new Array<{
            inventory: typeof inventory.$inferSelect;
            products: typeof products.$inferSelect;
          }>().length > 0 ? (
            <Heading size="mb" m={6}>
              Current inventory
            </Heading>
          ) : (
            <Heading size="mb" m={6}>
              No inventory to show
            </Heading>
          )}
          <Skeleton
            className="h-screen w-screen"
            isLoaded={inventoryQuery.isFetched}
          >
            <Center>
              <Wrap>
                {inventoryQuery.data?.map((item, index: number) => {
                  return (
                    <InventoryPurchaseItem
                      dosage={item?.products?.dosage?? new Array<string>()}
                      image={item.products.imageUrl}
                      key={index}
                      type={" "}
                      id={item.inventory.id}
                      title={item.products.name}
                      description={item.products.description}
                      price={item.products.averagePrice}
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
