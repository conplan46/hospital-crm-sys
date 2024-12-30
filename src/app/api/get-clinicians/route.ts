import { eq } from "drizzle-orm";
import { clinicians, users } from "drizzle/schema";
import { type NextApiRequest, type NextApiResponse } from "next";
import { db, pool, prisma } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getClinicians = await prisma.clinicians.findMany({
      include: { users: true },
    });
    console.log(getClinicians);
    return Response.json({ clinicians: getClinicians });
  } catch (e) {
    console.error(e);

    return new Response("error fetching clinicians", { status: 404 });
  }
}
