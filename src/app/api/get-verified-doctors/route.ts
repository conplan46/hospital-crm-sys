import { eq } from "drizzle-orm";
import { doctors, users } from "drizzle/schema";
import { db, pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getDoctors = await db
      .select()
      .from(doctors)
      .innerJoin(users, eq(users.id, doctors.userid))
      .where(eq(doctors.verified, true));

    console.log(getDoctors);
    return Response.json({ doctors: getDoctors });
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
