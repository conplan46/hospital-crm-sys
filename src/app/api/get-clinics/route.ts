import { eq } from "drizzle-orm";
import { clinics, users } from "drizzle/schema";
import { db, pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getClinics = await db
      .select()
      .from(clinics)
      .innerJoin(users, eq(users.id, clinics.userid));

    console.log(getClinics);
    return Response.json({ clinics: getClinics });
  } catch (e) {
    console.error(e);

    return Response.error();
  }
}
