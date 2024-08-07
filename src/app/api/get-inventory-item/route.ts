import { pool } from "utils/db-pool";
import { getServerAuthSession } from "~/server/auth";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const inventory_id = data.get("id");
    const session = await getServerAuthSession();
    console.log({ serverSesh: session });
    const inventory = await client.query(
      "SELECT * FROM inventory INNER JOIN products ON inventory.product_id = products.product_id WHERE inventory.id = $1",
      [inventory_id],
    );
//"SELECT * FROM inventory INNER JOIN products ON product_id = products.id WHERE inventory.id = $1",
    console.log({ inventory: inventory.rows });

    return Response.json({ inventory: inventory.rows, status: "success" });
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
