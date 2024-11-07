import { QueryResult } from "pg";
import { pool } from "utils/db-pool";
import { User } from "utils/used-types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email: string };
    const user: QueryResult<User> = await pool.query(
      "SELECT * FROM users WHERE email =$1",
      [body.email],
    );

    if (user?.rows && user.rows.length >= 0) {
      return Response.json({
        status: "success",
        isAdmin: user?.rows[0]?.userrole === "admin" ? true : false,
      });
    } else {
      return Response.json({ status: "fetching user failed" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
