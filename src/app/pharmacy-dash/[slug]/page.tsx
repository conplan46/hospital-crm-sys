"use client";

import storage from "utils/firebase-config";
import {
  Tooltip,
  Heading,
  Wrap,
  WrapItem,
  Center,
  Button,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react";
import { Button as ButtonShad } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Plus, X } from "lucide-react";
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
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { AddInvItem, IInventoryItem } from "utils/used-types";
import Loading from "~/app/loading";
import { InventoryItem } from "~/components/inventory-item";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
export default function PharmacyDashBoard({
  params,
}: {
  params: { slug: string };
}) {
  const [isClient, setIsClient] = useState(false);

  const { data: session, status } = useSession();

  const callBackUrl = usePathname();
  if (status === "unauthenticated") {
    void signIn(undefined, { callbackUrl: callBackUrl });
  }
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddInvItem>();
  const queryClient = useQueryClient();

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [inventory, setInventory] = useState<Array<IInventoryItem> | undefined>(
    undefined,
  );
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
  console.log({ inventoryQuery });

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
        formData.append("inventoryCount", `${data.inventoryCount}`);
        formData.append("estId", params.slug);
        fetch("/api/create-inv-item", { method: "POST", body: formData })
          .then((data) => data.json())
          .then((data: { status: string }) => {
            if (
              data.status ===
              "Item added to inventory and new product added to registry"
            ) {
              toast({
                description: "Item Added",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              void queryClient.invalidateQueries({ queryKey: ["inventory"] });
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (status == "loading") {
    return <Loading />;
  }
  if (!isClient) {
    return <Loading />;
  }
  if (isClient && status == "authenticated") {
    return (
      <>
        <div className="flex w-screen flex-col items-center justify-center">
          <Tooltip label="Add products" hasArrow arrowSize={15}>
            <div
              onClick={() => {
                onOpen();
              }}
              className="btn flex h-24 w-24 items-center justify-center rounded-lg border"
            >
              <FaPlus />
            </div>
          </Tooltip>

          {inventoryQuery?.data?.length ??
          new Array<IInventoryItem>().length > 0 ? (
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
                    <InventoryItem
                      key={index}
                      id={item.id}
                      title={item.name}
                      description={item.description}
                      invCount={parseInt(item.inventory_count)}
                    />
                  );
                })}
              </Wrap>
            </Center>
          </Skeleton>
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
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
                    Add New Drug Product
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
                      <FormErrorMessage>
                        {errors?.price?.message}
                      </FormErrorMessage>
                    </div>
                  </FormControl>
                  <FormControl isInvalid={Boolean(errors.inventoryCount)}>
                    <div className="space-y-2">
                      <Label htmlFor="averagePrice">inventory count</Label>
                      <Input
                        {...register("inventoryCount", {
                          required: "price is required",
                        })}
                        id="inventory count"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter inventory count"
                        required
                      />
                      <FormErrorMessage>
                        {errors?.inventoryCount?.message}
                      </FormErrorMessage>
                    </div>
                  </FormControl>

                  <Button
                    isLoading={isSubmitting}
                    type="submit"
                    className="w-full"
                  >
                    Add Drug Product
                  </Button>
                </form>
              </Center>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
}
