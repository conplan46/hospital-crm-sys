import { eq, like } from "drizzle-orm";
import { inventory, products } from "drizzle/schema";
import { db, prisma } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const query = data.get("query")?.toString();
    const results = await prisma.products.findMany({
      where: { name: { contains: query } },
    });
    return Response.json({ results });
  } catch (e) {
    console.error(e);
    return new Response("An internal error occured", { status: 404 });
  }
}
