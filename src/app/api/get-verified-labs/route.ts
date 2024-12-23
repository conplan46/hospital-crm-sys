import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    //const getClinicians = await db
    //  .select()
    //  .from(clinicians)
    //  .innerJoin(users, eq(clinicians.userid, users.id))
    //  .where(eq(clinicians.verified, true));
    const getLabs = await prisma.labs.findMany({
      where: { verified: true },
    });
    console.log({ verifiedLabs: getLabs });
    return Response.json({ labs: getLabs });
  } catch (e) {
    console.error(e);

    return new Response("error fetching labs", { status: 404 });
  }
}
