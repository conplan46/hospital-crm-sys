import { QueryResult } from "pg";
import { pool } from "utils/db-pool";
import { IInventoryItem } from "utils/used-types";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const invId = data.get("invId");
    const result: QueryResult<IInventoryItem> = await client.query(
      "DELETE FROM inventory WHERE id=$1 RETURNING *",
    );
    if (result.rows[0].id == parseInt(invId as string)) {
      return Response.json({ status: "inventory item deleted" });
    } else {
      return Response.json({ status: "An error occured deleting item" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
