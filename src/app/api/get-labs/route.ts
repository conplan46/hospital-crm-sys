import { labs } from "drizzle/schema";
import { db, pool, prisma } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getLabs = await prisma.labs.findMany({ include: { users: true } });
    console.log(getLabs);
    return Response.json({ labs: getLabs });
  } catch (e) {
    console.error(e);

    return Response.error();
  }
}
