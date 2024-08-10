import { QueryResult } from "pg";
import { pool } from "utils/db-pool";
import { User } from "utils/used-types";
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const patientName = `${data.get("firstName") as string} ${data.get("lastName") as string}`;
    const phoneNumber = data.get("phoneNumber");
    const email = data.get("email");
    console.log(data);
    const userQueryResult: QueryResult<User> = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (userQueryResult?.rows.length == 1) {
      const queryResult = await pool.query(
        "INSERT INTO patients(name,phonenumber,userId) VALUES($1,$2,$3)",
        [patientName, phoneNumber, userQueryResult?.rows[0]?.id],
      );
      if (queryResult.rowCount == 1) {
        return Response.json({ status: "patient added" });
      } else {
        return Response.json({
          status: "An internal error adding the patient",
        });
      }
    }
  } catch (e) {
    console.error(e);
    return Response.json({ status: "An internal error occured" });
  }
}
