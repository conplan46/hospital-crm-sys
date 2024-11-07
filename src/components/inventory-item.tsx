import {
  Button,
  Stat,
  StatLabel,
  StatNumber,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Card,
  CardFooter,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Info, Pill, DollarSign, Building2 } from "lucide-react";
export function InventoryItem({
  title,
  id,
  description,
  invCount,
}: {
  title: string;
  id: number;
  description: string;
  invCount: number;
}) {
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <WrapItem>
      <div className="card m-2 w-96 bg-base-100 shadow-xl">
        <div className="skeleton h-32 w-96"></div>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">inventory count</div>
              <div className="stat-value">{invCount}</div>
            </div>
          </div>
          <div className="card-actions justify-end">
            <button className="btn bg-[#285430]">Edit</button>

            <Button
              className="btn "
              colorScheme="red"
              isLoading={isDeleting}
              onClick={() => {
                setIsDeleting(true);
                const formData = new FormData();
                formData.append("invId", `${id}`);
                fetch("/api/delete-inventory", {
                  body: formData,
                  method: "POST",
                })
                  .then((data) => data.json())
                  .then(
                    (data: {
                      status: string | undefined;
                      error: string | undefined;
                    }) => {
                      setIsDeleting(false);
                      if (data.status) {
                        toast({ description: data.status, status: "success" });
                      } else {
                        toast({ description: data.error, status: "error" });
                      }
                    },
                  )
                  .catch((err) => {
                    console.log(err);
                    setIsDeleting(false);
                    toast({
                      description: "An error occured deleting item",
                      status: "error",
                    });
                  });
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </WrapItem>
  );
}
export function InventoryPurchaseItem({
  title,
  id,
  description,
  price,
  dosage,
  image,
  type,
}: {
  title: string;
  id: number;
  image: string;
  dosage: Array<string>;
  type: string;
  description: string;
  price: number;
}) {
  return (
    <Card key={id} className="flex flex-col">
      <CardHeader>
        <div className="relative mb-4 aspect-square">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <Badge variant={type === "Prescription" ? "destructive" : "secondary"}>
          {type}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4 text-sm text-muted-foreground"></p>
        <div className="space-y-2">
          <div className="flex items-center">
            <Pill className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm">Dosage: {dosage}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Link href={`/pharmacy/drug/${id}`} className="flex items-center">
            <Info className="mr-2 h-4 w-4" /> More Information
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
export function ProductComponent({
  title,
  description,
  id,
}: {
  id: number;
  title: string;
  description: string;
}) {
  return (
    <Link href={`/drug/${id}`}>
      <WrapItem>
        <div className="card m-2 w-96 bg-base-100 shadow-xl">
          <div className="skeleton h-32 w-96"></div>
          <div className="card-body">
            <h2 className="card-title">{title}</h2>
            <p>{description}</p>
            <div className="card-actions justify-end"></div>
          </div>
        </div>
      </WrapItem>
    </Link>
  );
}
