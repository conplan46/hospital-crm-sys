import { pool } from "utils/db-pool";

export async function GET(request: Request) {
  try {
    const getLabs = await pool.query("SELECT * FROM labs");

    if (getLabs?.rows && getLabs.rows.length >= 0) {
      console.log(getLabs?.rows);
      return Response.json({ status: "success", labs: getLabs.rows });
    } else {
      return Response.json({ status: "fetching labs failed" });
    }
  } catch (e) {
    console.error(e);

    return Response.json({ status: "An internal error occured" });
  }
}
