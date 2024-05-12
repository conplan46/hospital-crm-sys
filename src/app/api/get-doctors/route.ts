import { pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getDoctors = await pool.query("SELECT * FROM doctors");

    if (getDoctors?.rows && getDoctors.rows.length >= 0) {
      console.log(getDoctors?.rows)
      return Response.json({ status: "success", doctors: getDoctors.rows })

    } else {
      return Response.json({ status: "fetching doctors failed" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
