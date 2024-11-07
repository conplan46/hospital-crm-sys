import { clinics } from "drizzle/schema";
import { db, pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getClinics = await db.select().from(clinics);

    if (getClinics && getClinics.length >= 0) {
      console.log(getClinics);
      return Response.json({ status: "success", clinics: getClinics });
    } else {
      return Response.json({ status: "fetching clinicians failed" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
