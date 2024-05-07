import { QueryResult } from "pg";
import { pool } from "utils/db-pool";
import { User } from "utils/used-types";
export async function POST(request: Request) {
	try {
		const data = await request.formData();
		const name = data.get("name");
		const email = data.get("email");
		const phoneNumber = data.get("phoneNumber");
		const practicingLicense = data.get("practicingLicense");
		const location = data.get("location");
		const getEmailQuery: QueryResult<User> = await pool.query(
			"SELECT * FROM users WHERE EMAIL = $1",
			[email],
		);

		if (getEmailQuery?.rows[0]?.email) {
			const result = await pool.query(
				"INSERT INTO clinics(name,phoneNumber,location,userId,license_document_link) VALUES($1,$2,$3,$4,$5) RETURNING id ",
				[
					name,
					phoneNumber,
					location,
					getEmailQuery?.rows[0]?.id,
					practicingLicense,
				],
			);
			const updateRoleQuery = await pool.query(
				`UPDATE users set userRole='pharmacy' WHERE id='$1'`,
				[getEmailQuery?.rows[0]?.id],
			);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (result.rows[0].id && updateRoleQuery.rowCount == 1) {
				return Response.json({ status: "pharmacy added" });
			} else {
				return Response.json({
					status: "An internal error adding the pharmacy",
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
