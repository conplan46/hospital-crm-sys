import { eq } from "drizzle-orm";
import { pharmacy, users } from "drizzle/schema";
import { db, pool, prisma } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getPharmacies = await prisma.pharmacy.findMany({
      include: { users: true },
    });

    console.log(getPharmacies);
    return Response.json({ pharmacies: getPharmacies });
  } catch (e) {
    console.error(e);

    return Response.error();
  }
}
