//eslint-disable @typescript-eslint/non-nullable-type-assertion-style
import { eq } from "drizzle-orm";
import {
  bookings,
  clinicians,
  clinics,
  doctors,
  patients,
  users,
} from "drizzle/schema";
import { type QueryResult } from "pg";
import { db, pool } from "utils/db-pool";
import { type Booking } from "utils/used-types";
import { getServerAuthSession } from "~/server/auth";

export async function GET(request: Request) {
  const client = await pool.connect();
  try {
    const session = await getServerAuthSession();
    console.log({ session });
    if (session?.user.email) {
      /* const user: QueryResult<{ userrole: string; id: number }> =
        await client.query("SELECT userRole, id from users WHERE email = $1", [
          session?.user?.email,
        ]); */
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, session?.user?.email));
      if (user[0]) {
        //let query: QueryResult<{ id: number }>;
        //let res: QueryResult<Booking>;
        let query;
        let res = null;
        switch (user?.[0]?.userrole) {
          case "clinic":
            /* query = await client.query(
              "SELECT id from clinics WHERE userid = $1",
              [user?[0].id],
            ); */
            query = await db
              .select()
              .from(clinics)
              .where(eq(clinics.userid, user[0]?.id));
            if (query[0]?.id) {
              res = await db
                .select()
                .from(bookings)
                .innerJoin(patients, eq(bookings.patientId, patients.id))
                .where(eq(bookings.clinicHandler, query[0]?.id));
            }
            break;
          case "clinician":
            /* query = await client.query(
              "SELECT id from clinicians WHERE userid = $1",
              [user?.rows[0].id],
            );
            res = await client.query(
              "SELECT * from bookings WHERE clinician_handler =$1",
              [query?.rows[0]?.id],
            ); */

            query = await db
              .select()
              .from(clinicians)
              .where(eq(clinicians.userid, user[0]?.id));
            if (query[0]?.id) {
              res = await db
                .select()
                .from(bookings)
                .innerJoin(patients, eq(bookings.patientId, patients.id))
                .where(eq(bookings.clinicianHandler, query[0]?.id));
            }
            break;
          case "doctor":
            /* query = await client.query(
              "SELECT id from doctors WHERE userid = $1",
              [user?.rows[0].id],
            );
            res = await client.query(
              "SELECT * from bookings WHERE doctor_handler =$1",
              [query?.rows[0]?.id],
            ); */

            query = await db
              .select()
              .from(doctors)
              .where(eq(doctors.userid, user[0]?.id));
            if (query[0]?.id) {
              res = await db
                .select()
                .from(bookings)
                .innerJoin(patients, eq(bookings.patientId, patients.id))
                .where(eq(bookings.doctorHandler, query[0]?.id));
            }
            break;
          case "patient":
            /* query = await client.query(
              "SELECT id from patients WHERE userid = $1",
              [user?.rows[0].id],
            );
            res = await client.query(
              "SELECT * from bookings WHERE patient_id =$1",
              [query?.rows[0]?.id],
            );
            console.log({ booking: res }); */

            query = await db
              .select()
              .from(patients)
              .where(eq(patients.userId, user[0]?.id));
            if (query[0]?.id) {
              res = await db
                .select()
                .from(bookings)
                .innerJoin(patients, eq(bookings.patientId, patients.id))
                .where(eq(bookings.patientId, query[0]?.id));
            }
            break;
          default:
            return new Response("No matching cases found", { status: 404 });
        }
        if (res) {
          console.log(res);
          return Response.json({ bookings: res, status: "success" });
        } else {
          return new Response("No matching records found", { status: 404 });
        }
      } else {
        return new Response("No matching user found", { status: 404 });
      }
    } else {
      return new Response("Unauthorized", { status: 403 });
    }

    console.log({ serverSesh: session });
  } catch (error) {
    console.error(error);

    return Response.json({ status: "An internal error occured" });
  } finally {
    client.release();
  }
}
