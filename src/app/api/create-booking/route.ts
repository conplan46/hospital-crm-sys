import { pool } from "utils/db-pool";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const name = data.get("name");
    const handler = data.get("handler");
    const phoneNumber = data.get("phoneNumber");
    const booking = await client.query(
      "INSERT INTO bookings(name,mobileNumber,handler) VALUES($1,$2,$3) RETURNING id ",
      [name, phoneNumber, handler],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (booking.rows[0].id) {
      return Response.json({ status: "Booking Created" });
    } else {
      return Response.json({ status: "Error creating booking" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ status: "An internal error occured" });
  }
}
