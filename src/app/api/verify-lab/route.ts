import { eq } from "drizzle-orm";
import { labs } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const validTillDate = data.get("validTill")?.toString();
    const id = Number(data.get("id")?.toString());

    const verified = Boolean(data.get("verified")?.toString());
    if (verified) {
      const verified = await db
        .update(labs)
        .set({ validTill: null, verified: false })
        .where(eq(labs.id, id))
        .returning({ id: labs.id });
      if (verified?.[0]?.id) {
        return Response.json({ status: "success" });
      } else {
        return Response.json({
          status: "an error occured verifying the lab",
        });
      }
    } else {
      if (id && validTillDate) {
        const verified = await db
          .update(labs)
          .set({ validTill: validTillDate, verified: true })
          .where(eq(labs.id, id))
          .returning({ id: labs.id });
        if (verified?.[0]?.id) {
          return Response.json({ status: "success" });
        } else {
          return Response.json({
            status: "an error occured verifying the lab",
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
