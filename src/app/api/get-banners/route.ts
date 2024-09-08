import { adBanner } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const banners = await db.select().from(adBanner);
    console.log({ banners });
    return Response.json({ banners, status: "success" });
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
