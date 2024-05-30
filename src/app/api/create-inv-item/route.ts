import { QueryResult } from "pg";
import { pool } from "utils/db-pool";
import { Product } from "utils/used-types";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const productTitle = data.get("productTitle");
    const productDescription = data.get("productDescription");
    const inventoryCount = data.get("inventoryCount");
    const estId = data.get("estId");
    const getProductQuery = await client.query(
      "SELECT * FROM inventory WHERE product_name = $1",
      [productTitle],
    );
    if (getProductQuery?.rows.length > 0) {
      return Response.json({ status: "product exists" });
    } else {
      const res = await client.query(
        "INSERT INTO inventory (product_name,est_id,inventory_count,product_description) VALUES($1,$2,$3,$4) RETURNING id",
        [productTitle, estId, inventoryCount, productDescription],
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (res.rows[0].id) {
        return Response.json({ status: "Item added to inventory" });
      } else {
        return Response.json({
          status: "An internal error occured while adding inventory",
        });
      }
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  }finally{
client.release()
	}
}
