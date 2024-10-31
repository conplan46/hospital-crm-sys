import { and, eq } from "drizzle-orm";
import { inventory } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const estId = Number(data.get("estId"));
    const invId = Number(data.get("invId"));
    const inv = await db
      .update(inventory)
      .set({topProduct:true})
      .where(and(eq(inventory?.id, invId),eq(inventory?.estId,estId)))
      .returning({ id: inventory?.id });
    if (inv[0]?.id == invId) {
      return Response.json({ status: "Product promoted" });
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  }
}
