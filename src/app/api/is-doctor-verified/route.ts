import { eq } from "drizzle-orm";
import { clinicians, doctors } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const id = body.get("id".toString());
    const isVerified = await db
      .select()
      .from(doctors)
      .where(eq(doctors.id, Number(id)));

    const expired = new Date() > new Date(isVerified?.[0]?.validTill ?? "");
    if (expired) {
      const unverify = await db
        .update(doctors)
        .set({ validTill: null, verified: false });
    }
    if (isVerified?.[0]?.validTill) {
      return Response.json({ verified: isVerified[0]?.verified && !expired });
    } else {
      return Response.json({ verified: false });
    }
  } catch (e) {
    console.error(e);
    return new Response("Error verifying clincian", { status: 404 });
  }
}
