import { eq, like } from "drizzle-orm";
import { inventory, products } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const query = data.get("query")?.toString();
    const results = await db
      .select()
      .from(products)
      .innerJoin(inventory, eq(inventory.productId, products.productId))
      .where(like(products.name, `${query}%`));
    return Response.json({ results });
  } catch (e) {
    console.error(e);
    return new Response("An internal error occured", { status: 404 });
  }
}
