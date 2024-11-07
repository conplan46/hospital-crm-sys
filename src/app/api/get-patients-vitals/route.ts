import { eq } from "drizzle-orm";
import { patientVitalsRecords, patients } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const id = Number(body.get("id"));
    const patientVitals = await db
      .select()
      .from(patientVitalsRecords)
      .where(eq(patientVitalsRecords.patientId, id));
    return Response.json({ status: "success", vitals: patientVitals });
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
