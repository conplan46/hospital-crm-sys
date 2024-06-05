import { pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getClinics = await pool.query("SELECT * FROM clinics");

    if (getClinics?.rows && getClinics.rows.length >= 0) {
      console.log(getClinics?.rows);
      return Response.json({ status: "success", clinics: getClinics.rows });
    } else {
      return Response.json({ status: "fetching clinicians failed" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
