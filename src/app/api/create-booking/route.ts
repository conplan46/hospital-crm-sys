import { pool } from "utils/db-pool";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const handler = data.get("handler");
    const reasonForAppointment = data.get("reasonForAppointment");
    const patientId = data.get("patientId");
    const handlerRole = data.get("handlerRole");
    let booking;
    if (patientId && reasonForAppointment && handler) {
      switch (handlerRole) {
        case "clinician":
          booking = await client.query(
            "INSERT INTO bookings(patientId,clinician_handler) VALUES($1,$2) RETURNING id ",
            [patientId, handler],
          );
          await client.query(
            "UPDATE patients SET reason_for_appointment = $2 WHERE id=$1",
            [patientId, reasonForAppointment],
          );

          break;
        case "doctor":
          booking = await client.query(
            "INSERT INTO bookings(patientId,doctor_handler) VALUES($1,$2) RETURNING id ",
            [patientId, handler],
          );
          await client.query(
            "UPDATE patients SET reason_for_appointment = $2 WHERE id=$1",
            [patientId, reasonForAppointment],
          );

          break;
        case "clinic":
          booking = await client.query(
            "INSERT INTO bookings(patientId,clinic_handler) VALUES($1,$2,$3) RETURNING id ",
            [patientId, handler],
          );
          await client.query(
            "UPDATE patients SET reason_for_appointment = $2 WHERE id=$1",
            [patientId, reasonForAppointment],
          );

          break;
        default:
          return new Response("Error matching roles", { status: 404 });
      }
    } else {
      return new Response("Form data submitted is null", { status: 404 });
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
