import { QueryResult } from "pg";
import { pool, prisma } from "utils/db-pool";
import { Product } from "utils/used-types";

export async function GET(request: Request) {
  const client = await pool.connect();
  try {
    const result  = await prisma.products.findMany()
    return Response.json({ status: "success", products: result });
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
