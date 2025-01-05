import { eq } from "drizzle-orm";
import { nurse, users } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const nurses = await db
      .select()
      .from(nurse)
      .innerJoin(users, eq(nurse.userid, users.id));

    return Response.json({ nurses });
  } catch (e) {
    console.error(e);
    return Response.error();
  }
}
