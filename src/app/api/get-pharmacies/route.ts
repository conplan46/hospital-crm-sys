import { eq } from "drizzle-orm";
import { pharmacy } from "drizzle/schema";
import { db, pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getPharmacies = await db
      .select()
      .from(pharmacy)
      .where(eq(pharmacy.verified, true));

    if (getPharmacies && getPharmacies.length >= 0) {
      console.log(getPharmacies);
      return Response.json({ status: "success", pharmacies: getPharmacies });
    } else {
      return Response.json({ status: "fetching pharmacies failed" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
