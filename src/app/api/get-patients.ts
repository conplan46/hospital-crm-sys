
import { type NextApiRequest, type NextApiResponse } from "next";
import { pool } from "~/utils/db-pool";

const getPatients = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const patients = await pool.query("SELECT * FROM patients");

		if (patients?.rows && patients.rows.length >= 0) {
			console.log(patients?.rows)
			return res.status(200).json({ status: "success", patients: patients.rows })

		} else {
			return res.status(404).json({ status: "fetching patients failed" });
		}
	} catch (e) {
		console.error(e);

		return res.status(404).json({ status: "An internal error occured" });
	}
}
export default getPatients;
