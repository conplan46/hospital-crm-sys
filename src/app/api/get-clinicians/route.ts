import { clinicians } from "drizzle/schema";
import { type NextApiRequest, type NextApiResponse } from "next";
import { db, pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getClinicians = await db.select().from(clinicians);

    if (getClinicians && getClinicians.length >= 0) {
      console.log(getClinicians);
      return Response.json({ status: "success", clinicians: getClinicians });
    } else {
      return Response.json({ status: "fetching clinicians failed" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
