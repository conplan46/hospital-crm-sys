import { pool } from "utils/db-pool";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const product_id = data.get("id");
    const inventory = await client.query(
      "SELECT * FROM inventory INNER JOIN products ON inventory.product_id = products.product_id WHERE inventory.product_id = $1",
      [product_id],
    );
    console.log({ inventory: inventory.rows });

    return Response.json({ inventory: inventory.rows, status: "success" });
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
