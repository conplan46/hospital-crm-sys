import { genSaltSync, hashSync } from "bcrypt-ts";
import { type NextApiRequest, type NextApiResponse } from "next";
import { pool } from "~/utils/db-pool";
const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		console.log(req.body)
		const result = await pool.query('SELECT * FROM users WHERE EMAIL = $1', [req.body.email])
		if (result.rowCount != 0) {

			return res.status(200).json({ status: "email exists" });
		}

		const salt = genSaltSync(10);
		const hashedPassword = hashSync(req.body.password, salt);
		const insertionResult = await pool.query('INSERT INTO user (email,password) VALUES($1,$2) RETURNING id', [req.body.email, hashedPassword])
		if (insertionResult.rows[0].id) {

			return res.status(200).json({ status: "user added" });
		}
	} catch (error) {
		console.error(error)

		return res.status(200).json({ status: "An internal error occured" });
	}

}

export default createUser;
