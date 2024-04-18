import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { pool } from "~/utils/db-pool";
const onboardingDataSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	phoneNumber: z.string(),
	email: z.string(),
	primaryAreaOfSpeciality: z.string().optional(),
	countyOfPractice: z.string().optional(),

});
type onBoardingData = z.infer<typeof onboardingDataSchema>

const createClinician = async (req: NextApiRequest, res: NextApiResponse) => {
	try {

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const body: onBoardingData = req.body
		onboardingDataSchema.parse(req.body);
		const getEmailQuery = await pool.query("SELECT * FROM users WHERE EMAIL = $1", [body?.email])
		const result = await pool.query("INSERT INTO clinicians(firstName,lastName,phoneNumber,primaryAreaOfSpeciality,countyOfPractice,userId) VALUES($1,$2,$3,$4,$5,$6)",
			[body?.firstName, body?.lastName, body?.phoneNumber, body?.primaryAreaOfSpeciality, body?.countyOfPractice, getEmailQuery.rows[0].email])
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (result.rows[0].id) {

			return res.status(200).json({ status: "clinician added" });
		} else {

			return res.status(404).json({ status: "An internal error adding the clinician" });
		}
	} catch (e) {
		console.error(e)
		return res.status(404).json({ status: "An internal error occured" });
	}
}
export default createClinician;
