import { genSaltSync, hashSync } from "bcrypt-ts";
import { type NextApiRequest, type NextApiResponse } from "next";
import { pool } from "~/utils/db-pool";
type body = { email: string, password: string }
const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		console.log(req.body)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const body: body = req.body
		if (body.email && body.password) {

			const result = await pool.query('SELECT * FROM users WHERE EMAIL = $1', [body.email])
			if (result.rowCount != 0) {

				return res.status(200).json({ status: "email exists" });
			}

			const salt = genSaltSync(10);
			const hashedPassword = hashSync(body.password, salt);
			const insertionResult = await pool.query('INSERT INTO users (email,password) VALUES($1,$2) RETURNING id', [body.email, hashedPassword])
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (insertionResult.rows[0].id) {

				return res.status(200).json({ status: "user added" });
			}
		} else {

			return res.status(404).json({ status: "No credentials provided" });
		}
	} catch (error) {
		console.error(error)

		return res.status(404).json({ status: "An internal error occured" });
	}

}

export default createUser;
