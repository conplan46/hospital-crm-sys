import type { NextApiRequest, NextApiResponse } from "next"
import type { QueryResult } from "pg";
import { pool } from "~/utils/db-pool";
import type { Clinician, Patient } from "~/utils/used-types";
interface ExtendedNextApiRequest extends NextApiRequest { body: { email: string } }
const getUserData = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
	const user: QueryResult<{ user_role: string, id: number }> = await pool.query("SELECT user_role ,id FROM users WHERE email=$1", [req.body.email]);
	if (user.rows.length != 0) {
		switch (user.rows[0]?.user_role) {
			case 'patient':
				const patientData: QueryResult<Patient> = await pool.query("SELECT * FROM patients WHERE userid=$1", [user.rows[0].id]);
				if (patientData.rows.length != 0) {

					return res.status(200).json({ userData: patientData.rows[0], status: "success" })
				} else {
					return res.status(404).json({ status: "An error occured while fetching patient data" })
				}
			case 'clinician':
				const clinicianData: QueryResult<Clinician> = await pool.query("SELECT * FROM clinicians WHERE userid=$1", [user.rows[0].id]);
				if (clinicianData.rows.length != 0) {
					return res.status(200).json({ userData: clinicianData.rows[0], status: "success" })
				} else {

					return res.status(404).json({ status: "An error occured while fetching clinican data" })
				}


		}
	}
}
export default getUserData;
