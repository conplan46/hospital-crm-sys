import { eq } from "drizzle-orm";
import { pharmacy } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { estId: string };
    const isVerified = await db
      .select({ verified: pharmacy.verified })
      .from(pharmacy)
      .where(eq(pharmacy.id, Number(body.estId)));
    return Response.json({ verified: isVerified[0]?.verified });
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  }
}
