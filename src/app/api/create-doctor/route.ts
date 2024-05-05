import { z } from "zod";
import { pool } from "utils/db-pool";
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

export default async function POST(request: Request) {
	try {
		const data = await request.formData();
		const email = data.get("email");
		const lastName = data.get("lastName");
		const firstName = data.get("firstName");
		const phoneNumber = data.get("phoneNumber");
		const primaryAreaOfSpeciality = data.get("primaryAreaOfSpeciality");
		const countyOfPractice = data.get("countyOfPractice");
		const practicingLicense = data.get("practicingLicense");
		// const body: onBoardingData = req.body
		// onboardingDataSchema.parse(req.body);
		const getEmailQuery: QueryResult<User> = await pool.query(
			"SELECT * FROM users WHERE EMAIL = $1",
			[email],
		);
		if (getEmailQuery?.rows[0]?.email) {
			const result = await pool.query(
				"INSERT INTO doctors (firstName,lastName,phoneNumber,primaryAreaOfSpeciality,countyOfPractice,userId,license_document_link) VALUES($1,$2,$3,$4,$5,$6) RETURNING id",

				[
					firstName,
					lastName,
					phoneNumber,
					primaryAreaOfSpeciality,
					countyOfPractice,
					getEmailQuery?.rows[0]?.id,
					practicingLicense,
				],
			);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (result.rows[0].id) {
				return Response.json({ status: "doctor added" });
			} else {
				return Response.json({
					status: "An internal error adding the clinician",
				});
			}
		}
		else {
			return Response.json({
				status: "Corresponding user does not exist",
			});
		}
	} catch (e) {
		console.error(e);
		return Response.json({ status: "An internal error occured" });
	}
}
