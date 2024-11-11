import { labs } from "drizzle/schema";
import { db, pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getLabs = await db.select().from(labs);

    console.log(getLabs);
    return Response.json({ labs: getLabs });
  } catch (e) {
    console.error(e);

    return Response.error();
  }
}
