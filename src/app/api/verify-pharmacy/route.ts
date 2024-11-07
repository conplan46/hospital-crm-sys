import { eq } from "drizzle-orm";
import { pharmacy } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const validTillDate = data.get("validTill")?.toString();
    const id = Number(data.get("id")?.toString());
    if (id && validTillDate) {
      const verified = await db
        .update(pharmacy)
        .set({ validTill: validTillDate, verified: true })
        .where(eq(pharmacy.id, id))
        .returning({ id: pharmacy.id });
      if (verified?.[0]?.id) {
        return Response.json({ status: "success" });
      } else {
        return Response.json({
          status: "an error occured verifying the pharmacy",
        });
      }
    } else {
      return Response.json({ status: "submitted empty fields" });
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  }
}
