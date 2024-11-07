import { type NextApiRequest, type NextApiResponse } from "next";
import { pool } from "utils/db-pool";

export async function GET(request: Request) {
	try {
		const patients = await pool.query("SELECT * FROM patients");

		if (patients?.rows && patients.rows.length >= 0) {
			console.log(patients?.rows);
			return Response.json({ status: "success", patients: patients.rows });
		} else {
			return Response.json({ status: "fetching patients failed" });
		}
	} catch (e) {
		console.error(e);

		return Response.json({ status: "An internal error occured" });
	}
}
