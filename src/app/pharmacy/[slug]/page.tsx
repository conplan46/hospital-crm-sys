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
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { AddInvItem, IInventoryItem } from "utils/used-types";
import Loading from "~/app/loading";
import InventoryItem from "~/components/inventory-item";
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
		queryFn: async function() {
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
		console.log(data);
		setIsSubmitting(true);

		const formData = new FormData();
		formData.append("productTitle", data.productTitle);
		formData.append("productDescription", data.productDescription);
		formData.append("inventoryCount", `${data.inventoryCount}`);
		formData.append("estId", params.slug);
		fetch("/api/create-inv-item", { method: "POST", body: formData })
			.then((data) => data.json())
			.then((data: { status: string }) => {
				if (data.status === "Item added to inventory") {
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

					{inventoryQuery?.data?.length ?? new Array<IInventoryItem>().length > 0 ? (
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
											title={item.product_name}
											description={item.product_description}
											invCount={item.inventory_count}
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
									className="form-control m-4"
								>
									<FormControl
										className="mb-6"
										isInvalid={Boolean(errors.productTitle)}
									>
										<FormLabel className="font-bold text-black" htmlFor="name">
											Product title
										</FormLabel>
										<Input
											className="w-full"
											placeholder="Product title"
											{...register("productTitle", {
												required: "name is required",
											})}
										/>
										<FormErrorMessage>
											{errors?.productTitle?.message}
										</FormErrorMessage>
									</FormControl>
									<FormControl
										className="mb-6"
										isInvalid={Boolean(errors.productDescription)}
									>
										<FormLabel className="font-bold text-black" htmlFor="name">
											Product Description
										</FormLabel>
										<Textarea
											{...register("productDescription", {
												required: "description is required",
											})}
											placeholder="Enter product description"
										/>

										<FormErrorMessage>
											{errors?.productDescription?.message}
										</FormErrorMessage>
									</FormControl>
									<FormControl
										className="mb-6"
										isInvalid={Boolean(errors.inventoryCount)}
									>
										<FormLabel className="font-bold text-black" htmlFor="name">
											Inventory Count
										</FormLabel>
										<input
											type="number"
											{...register("inventoryCount", {
												required: "inventory counnt required",
											})}
											placeholder="enter initial inventory count"
											className="input w-full max-w-xs"
										/>

										<FormErrorMessage>
											{errors?.inventoryCount?.message}
										</FormErrorMessage>
									</FormControl>

									<div className="flex flex-row">
										<Button
											isLoading={isSubmitting}
											loadingText="Submitting"
											bgColor="#285430"
											type="submit"
										>
											Book
										</Button>
										<Button variant="ghost" onClick={onClose}>
											Close
										</Button>
									</div>
								</form>
							</Center>
						</ModalBody>
					</ModalContent>
				</Modal>
			</>
		);
	}
}
