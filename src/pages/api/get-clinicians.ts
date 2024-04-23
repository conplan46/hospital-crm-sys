import { type NextApiRequest, type NextApiResponse } from "next";
import { pool } from "~/utils/db-pool";

const createPatient = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const getClinicians = await pool.query("SELECT * FROM clinicians");

		if (getClinicians?.rows && getClinicians.rows.length >= 0) {
			return res.status(200).json({ status: "success", clinicians: getClinicians.rows })

		} else {
			return res.status(404).json({ status: "fetching clinicians failed" });
		}
	} catch (e) {
		console.error(e);

		return res.status(404).json({ status: "An internal error occured" });
	}
}
