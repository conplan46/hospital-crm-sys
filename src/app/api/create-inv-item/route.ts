/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
import { eq } from "drizzle-orm";
import { inventory, products } from "drizzle/schema";
import { QueryResult } from "pg";
import { db, pool } from "utils/db-pool";
import { Product } from "utils/used-types";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const productTitle = data.get("productTitle")?.toString();
    const productDescription = data.get("productDescription")?.toString();
    const productImageUrl = data.get("productImageUrl")?.toString();
    const productManufacturer = data.get("productManufacturer")?.toString();
    const inventoryCount = Number(data.get("inventoryCount")?.toString());
    const estId = Number(data.get("estId")?.toString());
    const price = Number(data.get("productPrice")?.toString());
    const dosages: Array<string> = JSON.parse(data.get("dosages") as string);
    console.log({ dosages });
    const getProductQuery = await db
      .select()
      .from(products)
      .where(eq(products.name, productTitle as string));

    if (getProductQuery?.[0]?.productId) {
      const res = await db
        .insert(inventory)
        .values({
          estId: estId,
          productId: getProductQuery?.[0]?.productId,
          inventoryCount: inventoryCount,
        })
        .returning({ id: inventory.id });

      if (res?.[0]?.id) {
        return Response.json({
          status:
            "product exists in the pharmaceutuical database but has been added to the inventory",
        });
      }
    } else {
      const product = await db
        .insert(products)
        .values({
          name: productTitle as string,
          description: productDescription as string,
          dosage: dosages,
          averagePrice: price,
          manufacturer: productManufacturer as string,
          imageUrl: productImageUrl as string,
        })
        .returning({ id: products.productId });
      if (product?.[0]?.id) {
        const inventoryEntry = await db
          .insert(inventory)
          .values({
            estId,
            productId: product?.[0]?.id,
            inventoryCount: inventoryCount,
          })
          .returning({ id: inventory.id });

        if (inventoryEntry?.[0]?.id) {
          return Response.json({
            status: "Item added to inventory and new product added to registry",
          });
        } else {
          return Response.json({
            status: "An internal error occured while adding inventory",
          });
        }
      }
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  } finally {
  }
}
