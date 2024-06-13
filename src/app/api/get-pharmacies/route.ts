
import { pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getPharmacies = await pool.query("SELECT * FROM pharmacy");

    if (getPharmacies?.rows && getPharmacies.rows.length >= 0) {
      console.log(getPharmacies?.rows);
      return Response.json({ status: "success", pharmacies: getPharmacies.rows });
    } else {
      return Response.json({ status: "fetching pharmacies failed" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
