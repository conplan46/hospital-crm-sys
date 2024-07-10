import { type QueryResult } from "pg";
import { pool } from "utils/db-pool";
import { type Booking } from "utils/used-types";
import { getServerAuthSession } from "~/server/auth";

export async function GET(request: Request) {
  const client = await pool.connect();
  try {
    const session = await getServerAuthSession();
    console.log({session})
    if (session) {
      const user: QueryResult<{ userrole: string; id: number }> =
        await client.query("SELECT userRole, id from users WHERE email = $1", [
          session?.user?.email,
        ]);
      if (user?.rows.length > 0) {
        let query: QueryResult<{ id: number }>;
        let res: QueryResult<Booking>;
        switch (user?.rows[0]?.userrole) {
          case "clinic":
            query = await client.query(
              "SELECT id from clinics WHERE userid = $1",
              [user?.rows[0].id],
            );
            res = await client.query(
              "SELECT * from bookings WHERE clinic_handler =$1",
              [query?.rows[0]?.id],
            );
            break;
          case "clinician":
            query = await client.query(
              "SELECT id from clinicians WHERE userid = $1",
              [user?.rows[0].id],
            );
            res = await client.query(
              "SELECT * from bookings WHERE clinician_handler =$1",
              [query?.rows[0]?.id],
            );
            break;
          case "doctor":
            query = await client.query(
              "SELECT id from doctors WHERE userid = $1",
              [user?.rows[0].id],
            );
            res = await client.query(
              "SELECT * from bookings WHERE doctor_handler =$1",
              [query?.rows[0]?.id],
            );
            break;
          default:
            return new Response("No matching cases found", { status: 404 });
        }
        if (res?.rows?.length > 0) {
          console.log(res?.rows)
          return Response.json({ bookings: res.rows[0], status: "success" });
        } else {
          return new Response("No matching records found", { status: 404 });
        }
      }
    } else {
      return new Response("Unauthorized", { status: 403 });
    }

    console.log({ serverSesh: session });
  } catch (error) {
    console.error(error)

    return Response.json({ status: "An internal error occured" });
  } finally {

    client.release();
  }
}
