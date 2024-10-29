import { inventory } from "drizzle/schema";
import { eq,and } from "drizzle-orm";
import { db, pool } from "utils/db-pool";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const invId = Number(data.get("invId"));

    const estId = Number(data.get("estId"));
    const result = await db
      .delete(inventory)
      .where(and(eq(inventory.id, invId), eq(inventory.estId, estId)))

      .returning({ id: inventory.id });
    if (result[0]?.id == invId) {
      return Response.json({ status: "inventory item deleted" });
    } else {
      return Response.json({ error: "An error occured deleting item" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ error: "An internal error occured" });
  } finally {
    client.release();
  }
}
