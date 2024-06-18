import { QueryResult } from "pg";
import { pool } from "utils/db-pool";
import { Product } from "utils/used-types";

export async function GET(request: Request) {
  const client = await pool.connect();
  try {
    const result: QueryResult<Product> = await client.query(
      "SELECT * FROM products",
    );
    return Response.json({ status: "success", products: result.rows });
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
