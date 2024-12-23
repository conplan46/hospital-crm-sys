import { eq } from "drizzle-orm";
import { inventory, products } from "drizzle/schema";
import { db, prisma } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    //const topProducts = await db
    //  .select()
    //  .from(inventory)
    //  .innerJoin(products, eq(inventory.productId, products.productId))
    //  .where(eq(inventory.topProduct, true));
    const topProducts = await prisma.inventory.findMany({
      where: { top_product: true },
      include: { products: true },
    });
    console.log({ topProducts });
    return Response.json({ topProducts });
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An unexpected error occured" });
  }
}
