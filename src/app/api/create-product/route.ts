/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
    const price = Number(data.get("productPrice")?.toString());
    const dosages: Array<string> = JSON.parse(
      data.get("dosages")?.toString() ?? "",
    );
    console.log({ dosages });
    const getProductQuery = await db
      .select()
      .from(products)
      .where(eq(products.name, productTitle ?? ""));

    if (getProductQuery?.[0]?.productId) {
      return Response.json({
        status: "product exists in the pharmaceutuical database",
      });
    } else {
      const product = await db
        .insert(products)
        .values({
          name: productTitle ?? "",
          description: productDescription ?? "",
          dosage: dosages,
          averagePrice: price,
          manufacturer: productManufacturer ?? "",
          imageUrl: productImageUrl ?? "",
        })
        .returning({ id: products.productId });
      if (product?.[0]?.id) {
        return Response.json({
          status: "Product added to the pharmaceutuical database",
        });
      } else {
        return Response.json({
          status: "An internal error occured while adding product",
        });
      }
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  } finally {
  }
}
