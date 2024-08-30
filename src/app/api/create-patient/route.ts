import { eq } from "drizzle-orm";
import { patients, users } from "drizzle/schema";
import { db, pool } from "utils/db-pool";
import { User } from "utils/used-types";
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const patientName = `${data.get("firstName") as string} ${data.get("lastName") as string}`;
    const phoneNumber = data.get("phoneNumber");
    const email = data.get("email");
    console.log(data);
    /*const userQueryResult: QueryResult<User> = await pool.query(
     "SELECT * FROM users WHERE email = $1",
      [email],
    );*/
    const userQueryResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email as string));

    if (userQueryResult[0]?.id) {
      const insertResult = await db
        .insert(patients)
        .values({
          name: patientName,
          phonenumber: phoneNumber as string,
          userid: userQueryResult[0]?.id,
        })
        .returning({ insertedId: patients.id });
      await db.update(users).set({userrole:"patient"}).where(eq(users.id,userQueryResult[0]?.id))
      /*const queryResult = await pool.query(
        "INSERT INTO patients(name,phonenumber,userId) VALUES($1,$2,$3)",
        [patientName, phoneNumber, userQueryResult?.rows[0]?.id],
      );*/
      if (insertResult[0]?.insertedId) {
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
