import { eq } from "drizzle-orm";
import { patients } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id: number };
    const getpatient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, body.id));
    return Response.json({ status: "success", patient: getpatient[0] });
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
