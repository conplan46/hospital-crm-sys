import { eq } from "drizzle-orm";
import { clinicians, users } from "drizzle/schema";
import { type NextApiRequest, type NextApiResponse } from "next";
import { db, pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getClinicians = await db
      .select()
      .from(clinicians)
      .innerJoin(users, eq(clinicians.userid, users.id));

    console.log(getClinicians);
    return Response.json({ clinicians: getClinicians });
  } catch (e) {
    console.error(e);

    return Response.error();
  }
}
