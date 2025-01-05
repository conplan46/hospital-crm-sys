import { eq } from "drizzle-orm";
import { products } from "drizzle/schema";
import { db, pool, prisma } from "utils/db-pool";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const product_id = Number(data.get("id"));
    const product = await prisma.products.findUnique({
      where: { product_id: product_id },
    });
    console.log({ product: product });

    return Response.json({ product, status: "success" });
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
