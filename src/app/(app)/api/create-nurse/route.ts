import { z } from "zod";
import { pool, prisma } from "utils/db-pool";
import { QueryResult } from "pg";
import { User } from "utils/used-types";
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
    const getEmailQuery = await prisma.users.findUnique({
      where: { email: email },
    });

    if (
      getEmailQuery?.email &&
      lastName &&
      firstName &&
      phoneNumber &&
      primaryAreaOfSpeciality &&
      countyOfPractice &&
      practicingLicense
    ) {
      const result = await prisma.nurse.create({
        data: {
          firstname: firstName,
          phonenumber: phoneNumber,
          practice_license_number: practicingLicense,
          lastname: lastName,
          countyofpractice: countyOfPractice,
          userid: getEmailQuery?.id,
        },
      });

      const updateRoleQuery = await prisma.users.update({
        where: { id: getEmailQuery?.id },
        data: { userrole: "nurse" },
      });
      if (result.id && updateRoleQuery?.userrole == "nurse") {
        return Response.json({ status: "nurse added" });
      } else {
        return Response.json({
          status: "An internal error adding the nurse",
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
