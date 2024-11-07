import { eq } from "drizzle-orm";
import { inventory, products } from "drizzle/schema";
import { db, pool } from "utils/db-pool";
import { getServerAuthSession } from "~/server/auth";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const inventory_id = Number(data.get("id")?.toString());
    const session = await getServerAuthSession();
    console.log({ serverSesh: session });
    const inventoryQuery = await db
      .select()
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.productId))
      .where(eq(inventory.id, inventory_id));
    //  await client.query(
    //  "SELECT * FROM inventory INNER JOIN products ON inventory.product_id = products.product_id WHERE inventory.id = $1",
    //  [inventory_id],
    //);
    //"SELECT * FROM inventory INNER JOIN products ON product_id = products.id WHERE inventory.id = $1",
    console.log({ inventory: inventoryQuery });

    return Response.json({ inventory: inventoryQuery, status: "success" });
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
