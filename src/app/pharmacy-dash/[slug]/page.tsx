"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
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
import { Button as ButtonShad } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
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
import { inventory, products } from "drizzle/schema";
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

  const [editingInventory, setEditingInventory] = useState<{
    inventory: typeof inventory.$inferSelect;
    products: typeof products.$inferSelect;
  } | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState<number | null>(
    editingInventory?.inventory?.inventoryCount ?? 0,
  );

  console.log({ editingInventory });
  const [price, setPrice] = useState<number | null>(
    editingInventory?.inventory?.price ?? 0,
  );
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleEditProduct = () => {
    console.log({ editingInventory });
    const formData = new FormData();

    if (editingInventory) {
      formData.append(
        "price",
        `${price ?? editingInventory?.inventory?.price}`,
      );
      formData.append(
        "inventoryCount",
        `${quantity ?? editingInventory?.inventory?.inventoryCount}`,
      );
      formData.append("estId", params.slug);

      formData.append("invId", `${editingInventory?.inventory?.id}`);
      fetch("/api/edit-inventory", { method: "POST", body: formData })
        .then((data) => data.json())
        .then((data: { status: string }) => {
          if (data.status === "Updated") {
            toast({
              description: "Item updated",
              status: "success",
              duration: 9000,
              isClosable: true,
            });

            setEditingInventory(null);
            setIsEditDialogOpen(false);
            setQuantity(0);

            setPrice(0);
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
    }
  };

  const handleDeleteProduct = () => {
    if (editingInventory) {
      const formData = new FormData();
      formData.append("estId", params.slug);

      formData.append("invId", `${editingInventory?.inventory?.id}`);
      fetch("/api/delete-inventory", { method: "POST", body: formData })
        .then((data) => data.json())
        .then((data: { status: string }) => {
          if (data.status === "inventory item deleted") {
            toast({
              description: "Item updated",
              status: "success",
              duration: 9000,
              isClosable: true,
            });

            setEditingInventory(null);
            setIsEditDialogOpen(false);
            setQuantity(0);

            setPrice(0);
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
    }
  };
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

  const onSubmit: SubmitHandler<AddInvItem> = async (data) => {
    try {
      console.log(data);
      setIsSubmitting(true);

      const formData = new FormData();

      if (true) {
        formData.append("productTitle", data.productTitle);
        formData.append("productPrice", `${data.price}`);
        formData.append("inventoryCount", `${data.inventoryCount}`);
        formData.append("estId", params.slug);
        fetch("/api/create-inv-item", { method: "POST", body: formData })
          .then((data) => data.json())
          .then((data: { status: string }) => {
            if (data.status === "Added to the inventory") {
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
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add item</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Center>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mx-auto max-w-2xl space-y-6 bg-white p-6"
                >
                  <h2 className="mb-6 text-center text-2xl font-bold">
                    Add Inventory
                  </h2>
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

                  <FormControl isInvalid={Boolean(errors.price)}>
                    <div className="space-y-2">
                      <Label htmlFor="averagePrice">Price</Label>
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

        <div className="container mx-auto p-4">
          <h1 className="mb-6 text-3xl font-bold">Pharmacy Dashboard</h1>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Inventory</h2>
            <ButtonShad
              onClick={() => {
                onOpen();
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Product
            </ButtonShad>
          </div>
          <Skeleton
            className="h-screen w-screen"
            isLoaded={inventoryQuery.isFetched}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryQuery.data?.map((item, index: number) => {
                  return (
                    <TableRow key={item?.inventory?.id}>
                      <TableCell>{item?.products?.name}</TableCell>
                      <TableCell>{item?.inventory?.inventoryCount}</TableCell>
                      <TableCell>
                        ${item?.inventory?.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Dialog
                          open={isEditDialogOpen}
                          onOpenChange={setIsEditDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <ButtonShad
                              variant="outline"
                              size="sm"
                              className="mr-2"
                              onClick={() => setEditingInventory(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </ButtonShad>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                            </DialogHeader>
                            {editingInventory && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-name"
                                    className="text-right"
                                  >
                                    Name
                                  </Label>
                                  <Input
                                    id="edit-name"
                                    value={editingInventory.products.name}
                                    disabled={true}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-quantity"
                                    className="text-right"
                                  >
                                    Quantity
                                  </Label>
                                  <Input
                                    id="edit-quantity"
                                    type="number"
                                    value={
                                      quantity ??
                                      editingInventory?.inventory
                                        ?.inventoryCount
                                    }
                                    placeholder={`${editingInventory?.inventory?.inventoryCount}`}
                                    onChange={(e) =>
                                      setQuantity(parseInt(e.target.value))
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-price"
                                    className="text-right"
                                  >
                                    Price
                                  </Label>
                                  <Input
                                    id="edit-price"
                                    type="number"
                                    step="0.01"
                                    placeholder={`${editingInventory?.inventory?.price}`}
                                    value={
                                      price ??
                                      editingInventory?.inventory?.price
                                    }
                                    onChange={(e) =>
                                      setPrice(parseFloat(e.target.value))
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                            )}
                            <ButtonShad onClick={handleEditProduct}>
                              Save Changes
                            </ButtonShad>
                          </DialogContent>
                        </Dialog>
                        <ButtonShad
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setEditingInventory(item);
                            handleDeleteProduct();
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </ButtonShad>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Skeleton>
        </div>
      </>
    );
  }
}
