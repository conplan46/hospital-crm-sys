import { eq } from "drizzle-orm";
import { doctors, users } from "drizzle/schema";
import { db, pool, prisma } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getDoctors = await prisma.doctors.findMany({
      include: { users: true },
    });
    console.log(getDoctors);
    return Response.json({ doctors: getDoctors });
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
