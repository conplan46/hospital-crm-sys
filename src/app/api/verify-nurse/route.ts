import { eq } from "drizzle-orm";
import { nurse } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const validTillDate = data.get("validTill")?.toString();

    const verified = Boolean(data.get("verified")?.toString());
    const id = Number(data.get("id")?.toString());
    if (verified) {
      const unVerifiedNurse = await db
        .update(nurse)
        .set({ validTill: null, verified: false })
        .where(eq(nurse.id, id))
        .returning({ id: nurse.id });

      if (unVerifiedNurse?.[0]?.id) {
        return Response.json({ status: "success" });
      } else {
        return Response.json({
          status: "an error occured verifying the nurse",
        });
      }
    } else {
      if (id && validTillDate) {
        const verified = await db
          .update(nurse)
          .set({ validTill: validTillDate, verified: true })
          .where(eq(nurse.id, id))
          .returning({ id: nurse.id });
        if (verified?.[0]?.id) {
          return Response.json({ status: "success" });
        } else {
          return Response.json({
            status: "an error occured verifying the nurse",
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
