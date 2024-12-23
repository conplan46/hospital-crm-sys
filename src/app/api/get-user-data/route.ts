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
import { db, pool, prisma } from "utils/db-pool";
import { UserDataDrizzle } from "utils/used-types";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const email = body.email;
    console.log(body);
    /*  const user: QueryResult<{ userrole: string; id: number }> =
      await client.query("SELECT userRole, id from users WHERE email = $1", [
        body?.email,
      ]); */
    //const user = await db
    //  .select()
    //  .from(users)
    //  .where(eq(users.email, email ?? ""));
    const user = await prisma.users.findUnique({
      where: { email: email },
      include: {
        pharmacy: true,
        patients: true,
        clinics: true,
        doctors: true,
        nurse: true,
        clinicians: true,
        labs: true,
      },
    });
    if (user) {
      return Response.json({ data: user, status: "success" });
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
