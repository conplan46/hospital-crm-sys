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

const createPatient = async (req: NextApiRequest, res: NextApiResponse) => {
	try {

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const body: onBoardingData = req.body
		onboardingDataSchema.parse(req.body);

		const getEmailQuery = await pool.query("SELECT * FROM users WHERE EMAIL = $1", [body?.email])
		console.log(getEmailQuery?.rows[0])
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (getEmailQuery?.rows[0]?.id) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const result = await pool.query("INSERT INTO patients (firstName,lastName,phoneNumber,userId) VALUES($1,$2,$3,$4) RETURNING id", [body?.firstName, body?.lastName, body?.phoneNumber, getEmailQuery?.rows[0]?.id])
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (result.rows[0].id) {

				return res.status(200).json({ status: "patient added" });
			} else {

				return res.status(404).json({ status: "An internal error adding the patient" });
			}
		}
	} catch (e) {
		console.error(e)
		return res.status(404).json({ status: "An internal error occured" });
	}
}
export default createPatient;
