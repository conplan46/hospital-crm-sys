import { type NextApiRequest, type NextApiResponse } from "next";
import { pool } from "utils/db-pool";

export async function GET(request: Request) {
	try {
		const getClinicians = await pool.query("SELECT * FROM clinicians");

		if (getClinicians?.rows && getClinicians.rows.length >= 0) {
			console.log(getClinicians?.rows)
			return Response.json({ status: "success", clinicians: getClinicians.rows })

		} else {
			return Response.json({ status: "fetching clinicians failed" });
		}
	} catch (e) {
		console.error(e);

		return Response.json({ status: "An internal error occured" });
	}
}
