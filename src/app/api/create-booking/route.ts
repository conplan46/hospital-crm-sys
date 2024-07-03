import { pool } from "utils/db-pool";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const name = data.get("name");
    const handler = data.get("handler");
    const phoneNumber = data.get("phoneNumber");
    const handlerRole = data.get("handlerRole");
    let booking;
    switch (handlerRole) {
      case "clinician":
        booking = await client.query(
          "INSERT INTO bookings(name,mobileNumber,clinicianHandler) VALUES($1,$2,$3) RETURNING id ",
          [name, phoneNumber, handler],
        );
        break;
      case "doctors":
        booking = await client.query(
          "INSERT INTO bookings(name,mobileNumber,doctorHandler) VALUES($1,$2,$3) RETURNING id ",
          [name, phoneNumber, handler],
        );
        break;
      case "clinic":
        booking = await client.query(
          "INSERT INTO bookings(name,mobileNumber,clinicHandler) VALUES($1,$2,$3) RETURNING id ",
          [name, phoneNumber, handler],
        );
        break;
      default:
        return new Response("Error matching roles", { status: 404 });
    }

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
