import { eq } from "drizzle-orm";
import { clinics } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const validTillDate = data.get("validTill")?.toString();

    const verified = Boolean(data.get("verified")?.toString());
    const id = Number(data.get("id")?.toString());
    if (verified) {
      const unVerified = await db
        .update(clinics)
        .set({ validTill: null, verified: false })
        .where(eq(clinics.id, id))
        .returning({ id: clinics.id });
      if (unVerified?.[0]?.id) {
        return Response.json({ status: "success" });
      } else {
        return Response.json({
          status: "an error occured unverifying the clinic",
        });
      }
    } else {
      if (id && validTillDate) {
        const verified = await db
          .update(clinics)
          .set({ validTill: validTillDate, verified: true })
          .where(eq(clinics.id, id))
          .returning({ id: clinics.id });
        if (verified?.[0]?.id) {
          return Response.json({ status: "success" });
        } else {
          return Response.json({
            status: "an error occured verifying the clinic",
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
