import { doctors } from "drizzle/schema";
import { db, pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getDoctors = await db.select().from(doctors);

    if (getDoctors && getDoctors.length >= 0) {
      console.log(getDoctors);
      return Response.json({ status: "success", doctors: getDoctors });
    } else {
      return Response.json({ status: "fetching doctors failed" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
