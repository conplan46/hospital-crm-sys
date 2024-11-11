import { eq } from "drizzle-orm";
import { clinicians } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const validTillDate = data.get("validTill")?.toString();
    const id = Number(data.get("id")?.toString());
    const verified = Boolean(data.get("verified")?.toString());
    if (verified) {
      const unVerified = await db
        .update(clinicians)
        .set({ validTill: null, verified: false })
        .where(eq(clinicians.id, id))
        .returning({ id: clinicians.id });
      if (unVerified?.[0]?.id) {
        return Response.json({ status: "success" });
      } else {
        return Response.json({
          status: "an error occured verifying the clincian",
        });
      }
    } else {
      if (id && validTillDate) {
        const verified = await db
          .update(clinicians)
          .set({ validTill: validTillDate, verified: true })
          .where(eq(clinicians.id, id))
          .returning({ id: clinicians.id });
        if (verified?.[0]?.id) {
          return Response.json({ status: "success" });
        } else {
          return Response.json({
            status: "an error occured verifying the clincian",
          });
        }
      } else {
        return Response.json({ status: "submitted empty fields" });
      }
    }
  } catch (e) {
    console.error(e);
    return Response.error();
  }
}
