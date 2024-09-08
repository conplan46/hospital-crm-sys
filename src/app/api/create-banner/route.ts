import { adBanner } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const bannerUrl = data.get("banner") as string;
    const banner = await db
      .insert(adBanner)
      .values({ imageUrl: bannerUrl })
      .returning();
    if (banner[0]?.imageUrl == bannerUrl) {
      return Response.json({ status: "banner added" });
    } else {
      return Response.json({
        status: "An internal error adding the banner",
      });
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  }
}
