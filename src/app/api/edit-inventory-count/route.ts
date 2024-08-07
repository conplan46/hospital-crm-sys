import { QueryResult } from "pg";
import { pool } from "utils/db-pool";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const productiD = data.get("productId");
    const inventoryCount = data.get("inventoryCount");
    const estId = data.get("estId");
    const updatedInvItem = await client.query(
      "UPDATE inventory SET inventory_count=$1 WHERE est_id=$2 AND product_id=$3",
      [estId, productiD],
    );
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
