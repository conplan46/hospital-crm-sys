import { eq } from "drizzle-orm";
import { pharmacy, users } from "drizzle/schema";
import { QueryResult } from "pg";
import { db, pool } from "utils/db-pool";
import { User } from "utils/used-types";
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const name = data.get("name")?.toString();
    const email = data.get("email");
    const phoneNumber = data.get("phoneNumber")?.toString();
    const location = data.get("location")?.toString();
    const licenseNumber = data.get("licenseNumber")?.toString();
    const facilityRegistrationNumber = data
      .get("facilityRegistrationNumber")
      ?.toString();
    const getEmailQuery = await db
      .select()
      .from(users)
      .where(eq(users.email, email?.toString() ?? ""));

    if (
      getEmailQuery?.[0] &&
      licenseNumber &&
      name &&
      phoneNumber &&
      location &&
      facilityRegistrationNumber
    ) {
      const result = await db
        .insert(pharmacy)
        .values({
          estname: name,
          phonenumber: phoneNumber,
          location: location,
          userid: getEmailQuery?.[0]?.id,
          facilityRegistrationNumber: facilityRegistrationNumber,
          licenseNumber: licenseNumber,
        })
        .returning({ id: pharmacy.id });

      const updateRoleQuery = await db
        .update(users)
        .set({ userrole: "pharmacy" })
        .where(eq(users.id, getEmailQuery?.[0]?.id));

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (result?.[0]?.id && updateRoleQuery.rowCount == 1) {
        return Response.json({ status: "pharmacy added" });
      } else {
        return Response.json({
          status: "An internal error adding the pharmacy",
        });
      }
    } else {
      return Response.json({
        status: "Corresponding user does not exist",
      });
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  }
}
