import type { QueryResult } from "pg";
import { pool } from "utils/db-pool";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const body = (await request.json()) as { email: string };
    console.log(body);
    const user: QueryResult<{ userrole: string; id: number }> =
      await client.query("SELECT userRole, id from users WHERE email = $1", [
        body?.email,
      ]);
    if (user?.rows.length > 0) {
      let query: QueryResult;
      switch (user?.rows[0]?.userrole) {
        case "clinic":
          query = await client.query(
            "SELECT * from clinics INNER JOIN users ON clinics.userid = users.id WHERE userid = $1",
            [user?.rows[0].id],
          );

          break;
        case "clinician":
          query = await client.query(
            "SELECT * from clinicians INNER JOIN users ON clinicians.userid = users.id WHERE userid = $1",
            [user?.rows[0].id],
          );

          break;
        case "doctor":
          query = await client.query(
            "SELECT * from doctors INNER JOIN users ON doctors.userid = users.id WHERE userid = $1",
            [user?.rows[0].id],
          );

          break;
        case "pharmacy":
          query = await client.query(
            "SELECT * from pharmacy INNER JOIN users ON pharmacy.userid = users.id WHERE userid = $1",
            [user?.rows[0].id],
          );

          break;
        case "nurse":
          query = await client.query(
            "SELECT * from nurses INNER JOIN users ON nurses.userid = users.id WHERE userid = $1",
            [user?.rows[0].id],
          );

          break;
        case "patient":
          query = await client.query(
            "SELECT * from clincians INNER JOIN users ON clinicians.userid = users.id WHERE userid = $1",
            [user?.rows[0].id],
          );

          break;

        case "pharmacist":
          query = await client.query(
            "SELECT * from patient INNER JOIN users ON patient.userid = users.id WHERE userid = $1",
            [user?.rows[0].id],
          );
          break;
        default:
          return new Response("No matching cases found", { status: 404 });
      }
      if (query?.rows?.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return Response.json({ data: query.rows[0], status: "success" });
      } else {
        return new Response("No matching records found", { status: 404 });
      }
    } else {
      return new Response("No user found", { status: 404 });
    }
  } catch (e) {
    console.error(e);
    return new Response("An internal error occured", { status: 404 });
  } finally {
    client.release();
  }
}
