import { eq } from "drizzle-orm";
import { patients } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const patientId = Number(data.get("id"));
    const weight = Number(data.get("weight"));
    const patient = await db
      .update(patients)
      .set({ weight: weight })
      .where(eq(patients.id, patientId))
      .returning({ id: patients.id });
    if (patient[0]?.id == patientId) {
      return Response.json({ status: "updated successfully" });
    } else {
      return Response.json({ status: "error updating" });
    }
  } catch (e) {
    console.error(e);
    return new Response("An internal error occured", { status: 404 });
  }
}
