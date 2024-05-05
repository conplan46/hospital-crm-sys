import { genSaltSync, hashSync } from "bcrypt-ts";
import { type NextApiRequest, type NextApiResponse } from "next";
import { pool } from "utils/db-pool";
type body = { email: string, password: string }
export async function POST(request: Request) {
	try {
		console.log(request.body)

		const data = await request.formData()
		const email = data.get('email')
		const password = data.get('password')
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		//const body: body = request.body
		console.log({ email, password })
		if (email && password) {

			const result = await pool.query('SELECT * FROM users WHERE EMAIL = $1', [email])
			if (result.rowCount != 0) {

				return Response.json({ status: "email exists" });
			}

			const salt = genSaltSync(10);
			const hashedPassword = hashSync(password as string, salt);
			const insertionResult = await pool.query('INSERT INTO users (email,password) VALUES($1,$2) RETURNING id', [email, hashedPassword])
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (insertionResult.rows[0].id) {

				return Response.json({ status: "user added" });
			}
		} else {

			return Response.json({ status: "No credentials provided" });
		}
	} catch (error) {
		console.error(error)

		return Response.json({ status: "An internal error occured" });
	}

}
