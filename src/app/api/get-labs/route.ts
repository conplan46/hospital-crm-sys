import { labs } from "drizzle/schema";
import { db, pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getLabs = await db.select().from(labs);

    if (getLabs && getLabs?.length >= 0) {
      console.log(getLabs);
      return Response.json({ status: "success", labs: getLabs });
    } else {
      return Response.json({ status: "fetching labs failed" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
