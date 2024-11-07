import { eq } from "drizzle-orm";
import { inventory, products } from "drizzle/schema";
import { db, pool } from "utils/db-pool";
import { getServerAuthSession } from "~/server/auth";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const session = await getServerAuthSession();
    console.log({ serverSesh: session });
    const body = (await request.json()) as { estId: string };
    const inventoryQuery = await db
      .select()
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.productId))
      .where(eq(inventory.estId, Number(body.estId)));

    //"SELECT * FROM inventory INNER JOIN products ON product_id = products.id WHERE est_id = $1 "
    console.log({ inventory: inventoryQuery });

    return Response.json({ inventory: inventoryQuery, status: "success" });
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
