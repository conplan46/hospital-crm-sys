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
    const getProductQuery: QueryResult<Product> = await client.query(
      "SELECT * FROM products WHERE name = $1",
      [productTitle],
    );
    if (getProductQuery?.rows.length > 0) {
      const res = await client.query(
        "INSERT INTO inventory (est_id,product_id,inventory_count) VALUES($1,$2,$3) RETURNING id",
        [estId, getProductQuery?.rows[0]?.id,inventoryCount],
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (res.rows[0].id) {
        return Response.json({
          status:
            "product exists in the pharmaceutuical database but has been added to the inventory",
        });
      }
    } else {
      const product = await client.query(
        "INSERT INTO products(name,description) VALUES($1,$2) RETURNING id",
        [productTitle, productDescription],
      );
      const inventoryEntry = await client.query(
        "INSERT INTO inventory (est_id,product_id,inventory_count) VALUES($1,$2,$3) RETURNING id",
        [
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          estId,

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          product?.rows[0]?.id,
          inventoryCount
        ],
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (inventoryEntry.rows[0].id) {
        return Response.json({
          status: "Item added to inventory and new product added to registry",
        });
      } else {
        return Response.json({
          status: "An internal error occured while adding inventory",
        });
      }
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
