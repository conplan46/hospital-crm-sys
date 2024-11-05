import { z } from "zod";
import { db, pool } from "utils/db-pool";
import { QueryResult } from "pg";
import { User } from "utils/used-types";
import { clinicians, users } from "drizzle/schema";
import { eq } from "drizzle-orm";
const onboardingDataSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  primaryAreaOfSpeciality: z.string().optional(),
  countyOfPractice: z.string().optional(),
});
type onBoardingData = z.infer<typeof onboardingDataSchema>;

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const email = data.get("email")?.toString();
    const lastName = data.get("lastName")?.toString();
    const firstName = data.get("firstName")?.toString();
    const phoneNumber = data.get("phoneNumber")?.toString();
    const primaryAreaOfSpeciality = data
      .get("primaryAreaOfSpeciality")
      ?.toString();
    const countyOfPractice = data.get("countyOfPractice")?.toString();
    const practicingLicense = data.get("practicingLicense")?.toString();
    // const body: onBoardingData = req.body
    // onboardingDataSchema.parse(req.body);
    if (
      email &&
      lastName &&
      firstName &&
      phoneNumber &&
      primaryAreaOfSpeciality &&
      countyOfPractice &&
      practicingLicense
    ) {
      const getEmailQuery = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (getEmailQuery?.[0]?.email) {
        const result = await db
          .insert(clinicians)
          .values({
            firstname: firstName,
            lastname: lastName,
            phonenumber: phoneNumber,
            primaryareaofspeciality: primaryAreaOfSpeciality,
            countyofpractice: countyOfPractice,
            userid: getEmailQuery?.[0].id,
            practiceLicenseNumber: practicingLicense,
          })
          .returning({ id: clinicians.id });

        const updateRoleQuery = await db
          .update(users)
          .set({ userrole: "clinician" })
          .where(eq(users.id, getEmailQuery?.[0]?.id));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (result?.[0]?.id && updateRoleQuery.rowCount == 1) {
          return Response.json({ status: "clinician added" });
        } else {
          return Response.json({
            status: "An internal error adding the clinician",
          });
        }
      } else {
        return Response.json({
          status: "Corresponding user does not exist",
        });
      }
    } else {
      return Response.json({
        status:
          "One onf the fields required to register the clinicians is empty",
      });
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  }
}
