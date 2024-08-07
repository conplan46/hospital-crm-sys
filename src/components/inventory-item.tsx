import {
  Button,
  Stat,
  StatLabel,
  StatNumber,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
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
  invCount,
}: {
  title: string;
  id: number;
  description: string;
  invCount: string;
}) {
  return (
    <WrapItem>
      <div className="card m-2 w-96 bg-base-100 shadow-xl">
        <div className="skeleton h-32 w-96"></div>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <Stat>
            <StatLabel>inventory count</StatLabel>
            <StatNumber>{invCount}</StatNumber>
          </Stat>
          <div className="card-actions justify-end">
            <Link href={`/pharmacy/drug/${id}`} className="btn bg-[#285430]">
              purchase
            </Link>
          </div>
        </div>
      </div>
    </WrapItem>
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
