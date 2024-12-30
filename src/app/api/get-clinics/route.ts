import { eq } from "drizzle-orm";
import { clinics, users } from "drizzle/schema";
import { db, pool, prisma } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getClinics = await prisma.clinics.findMany({
      include: { users: true },
    });
    console.log(getClinics);
    return Response.json({ clinics: getClinics });
  } catch (e) {
    console.error(e);

    return Response.error();
  }
}
