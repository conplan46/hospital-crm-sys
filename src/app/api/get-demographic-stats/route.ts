/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getDoctorsCount = await pool.query("SELECT COUNT(id) FROM doctors");

    const getClinicsCount = await pool.query("SELECT COUNT(id) FROM clinics");
    const getClinicianCount = await pool.query(
      "SELECT COUNT(id) FROM clinicians",
    );
    const getPharmaciesCount = await pool.query(
      "SELECT COUNT(id) FROM pharmacy",
    );
    console.log(getDoctorsCount?.rows);

    return Response.json({
      status: "success",

      doctorCount: getDoctorsCount.rows[0].count,
      clinicsCount: getClinicsCount.rows[0].count,
      clinicianCount: getClinicianCount.rows[0].count,
      pharmaciesCount: getPharmaciesCount.rows[0].count,
    });
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
