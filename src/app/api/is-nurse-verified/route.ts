import { eq } from "drizzle-orm";
import { nurse } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { estId: string };
    const isVerified = await db
      .select()
      .from(nurse)
      .where(eq(nurse.id, Number(body.estId)));
    if (isVerified?.[0]?.validTill) {
      const expired = new Date(isVerified?.[0]?.validTill) > new Date();
      return Response.json({ verified: isVerified[0]?.verified && !expired });
    } else {
      return new Response("Error verifying nurse", { status: 404 });
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  }
}
