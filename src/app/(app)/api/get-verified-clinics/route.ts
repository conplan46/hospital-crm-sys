import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    //const getClinicians = await db
    //  .select()
    //  .from(clinicians)
    //  .innerJoin(users, eq(clinicians.userid, users.id))
    //  .where(eq(clinicians.verified, true));
    const getClinics = await prisma.clinics.findMany({
      where: { verified: true },
    });
    console.log({ verifiedClinics: getClinics });
    return Response.json({ clinics: getClinics });
  } catch (e) {
    console.error(e);

    return new Response("error fetching clinics", { status: 404 });
  }
}
