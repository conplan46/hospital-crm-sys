import { eq } from "drizzle-orm";
import { pharmacy, users } from "drizzle/schema";
import { db, pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getPharmacies = await db
      .select()
      .from(pharmacy)
      .innerJoin(pharmacy, eq(pharmacy.userid, users.id))
      .where(eq(pharmacy?.verified, true));

    console.log(getPharmacies);
    return Response.json({ pharmacies: getPharmacies });
  } catch (e) {
    console.error(e);

    return Response.error();
  }
}
