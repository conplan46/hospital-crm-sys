/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
import { eq } from "drizzle-orm";
import { inventory, products } from "drizzle/schema";
import { QueryResult } from "pg";
import { db, pool } from "utils/db-pool";
import { Product } from "utils/used-types";
import { env } from "~/env";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const productTitle = data.get("productTitle")?.toString();
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
          price: price,
          inventoryCount: inventoryCount,
        })
        .returning({ id: inventory.id });
      if (res?.[0]?.id) {
        await db
          .update(inventory)
          .set({ productUrl: `${env?.NEXTAUTH_URL}/pharmacy/${res?.[0]?.id}` });

        return Response.json({
          status: "Added to the inventory",
        });
      }
    } else {
      return Response.json({ status: "Product does not exist" });
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  } finally {
  }
}
