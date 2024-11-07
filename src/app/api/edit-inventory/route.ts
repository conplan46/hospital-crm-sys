import { eq,and } from "drizzle-orm";
import { inventory } from "drizzle/schema";
import { QueryResult } from "pg";
import { db, pool } from "utils/db-pool";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const invId = Number(data.get("invId"));
    const inventoryCount = Number(data.get("inventoryCount"));
    const estId = Number(data.get("estId"));
    const price = Number(data.get("price"));
    const updatedInvItem = await db
      .update(inventory)
      .set({ inventoryCount: inventoryCount, price: price })
      .where(and(eq(inventory.id, invId), eq(inventory.estId, estId)))
      .returning({ id: inventory.id });
    if (updatedInvItem[0]?.id) {
      return Response.json({ status: "Updated" });
    } else {
      return Response.json({ status: "An internal error occured" });
    }
    /*await client.query(
      "UPDATE inventory SET inventory_count=$1 WHERE est_id=$2 AND product_id=$3",
      [estId, productiD],
    );*/
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
