import { eq } from "drizzle-orm";
import {
  clinicians,
  clinics,
  doctors,
  nurse,
  patients,
  pharmacy,
  users,
} from "drizzle/schema";
import type { QueryResult } from "pg";
import { db, pool } from "utils/db-pool";
import { UserDataDrizzle } from "utils/used-types";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const body = await request.formData();
    const email = body.get("email")?.toString();
    console.log(body);
    /*  const user: QueryResult<{ userrole: string; id: number }> =
      await client.query("SELECT userRole, id from users WHERE email = $1", [
        body?.email,
      ]); */
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email ?? ""));
    let query:
      | Array<{
          users: typeof users.$inferSelect;
          clinics?: typeof clinics.$inferSelect;
          clinicians?: typeof clinicians.$inferSelect;
          doctors?: typeof doctors.$inferSelect;
          pharmacy?: typeof pharmacy.$inferSelect;
          patients?: typeof patients.$inferSelect;
          nurse?: typeof nurse.$inferSelect;
        }>
      | undefined = undefined;
    if (user?.length > 0) {
      switch (user?.[0]?.userrole) {
        case "clinic":
          /* query = await client.query(
            "SELECT * from clinics INNER JOIN users ON clinics.userid = users.id WHERE userid = $1",
            [user?.rows[0].id], 
          );*/
          query = await db

            .select()
            .from(clinics)
            .innerJoin(users, eq(users, eq(clinics.userid, users.id)))
            .where(eq(clinics.userid, user?.[0].id));

          break;
        case "clinician":
          /* query = await client.query(
            "SELECT * from clinicians INNER JOIN users ON clinicians.userid = users.id WHERE userid = $1",
            [user?.rows[0].id],
          ); */
          query = await db
            .select()
            .from(clinicians)
            .innerJoin(users, eq(clinicians.userid, users.id))
            .where(eq(clinicians.userid, user?.[0].id));

          break;
        case "doctor":
          /* query = await client.query(
            "SELECT * from doctors INNER JOIN users ON doctors.userid = users.id WHERE userid = $1",
            [user?.[0].id],
          ); */
          query = await db
            .select()
            .from(doctors)
            .innerJoin(users, eq(doctors.userid, users.id))
            .where(eq(doctors.userid, user?.[0].id));
          break;
        case "pharmacy":
          /* query = await client.query(
            "SELECT * from pharmacy INNER JOIN users ON pharmacy.userid = users.id WHERE userid = $1",
            [user?.[0].id],
          ); */
          query = await db
            .select()
            .from(pharmacy)
            .innerJoin(users, eq(pharmacy.userid, users.id))
            .where(eq(pharmacy.userid, user?.[0].id));

          break;
        case "nurse":
          query = await db
            .select()
            .from(nurse)
            .innerJoin(users, eq(nurse.userid, users.id))
            .where(eq(nurse.userid, user?.[0].id));
          break;
        case "patient":
          query = await db
            .select()
            .from(patients)
            .innerJoin(users, eq(patients.userId, users.id))
            .where(eq(patients.userId, user?.[0].id));
          /* query = await client.query(
            "SELECT * from users INNER JOIN patients ON users.id=patients.user_id  WHERE users.id = $1",
            [user?.rows[0].id],
          );
          console.log(query.rows[0]); */

          break;

        case "pharmacist":
          /* query = await client.query(
            "SELECT * from pharmacy INNER JOIN users ON pharmacy.userid = users.id WHERE userid = $1",
            [user?.rows[0].id],
          ); */
          //query = await db.select().from(pharmacist)
          break;

        default:
          return new Response("No matching cases found", { status: 404 });
      }

      if (query?.length ?? 0 > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return Response.json({ data: query, status: "success" });
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
