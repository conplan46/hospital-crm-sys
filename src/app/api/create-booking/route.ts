import { eq } from "drizzle-orm";
import { bookings, patients, users } from "drizzle/schema";
import { db, pool } from "utils/db-pool";

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.formData();
    const handler = data.get("handler");
    const email = data.get("email");
    const reasonForAppointment = data.get("reasonForAppointment");
    const nurseVisit =
      data.get("nurseVisit")?.toString().toLowerCase() === "true";
    const labTestRequest =
      data.get("labTestRequest")?.toString().toLowerCase() === "true";
    const prescriptionRequest =
      data.get("prescriptionRequest")?.toString().toLowerCase() === "true";
    const medicalExamRequest =
      data.get("medicalExamRequest")?.toString().toLowerCase() === "true";
    const handlerRole = data.get("handlerRole");
    let booking;
    const patientUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email as string));
    const patient = await db
      .select()
      .from(patients)

      //eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      .where(eq(patients.userId, patientUser?.[0]?.id as number));
    if (patient[0]?.id && reasonForAppointment && handler) {
      switch (handlerRole) {
        case "clinician":
          /*booking = await client.query(
            "INSERT INTO bookings(patient_id,clinician_handler) VALUES($1,$2) RETURNING id ",
            [patient[0]?.id, handler],
          );*/
          /*await client.query(
            "UPDATE patients SET reason_for_appointment = $2 WHERE id=$1",
            [patient[0]?.id, reasonForAppointment],
          );*/
          booking = await db
            .insert(bookings)
            .values({
              patientId: patient?.[0]?.id,
              clinicianHandler: parseInt(handler as string),
              reasonForAppointMent: reasonForAppointment as string,
              requestNurseVisit: nurseVisit,
              prescriptionRequest: prescriptionRequest,
              medicalExamRequest: medicalExamRequest,
              labTestRequest: labTestRequest,
            })
            .returning();
          break;
        case "doctor":
          /* booking = await client.query(
            "INSERT INTO bookings(patient_id,doctor_handler) VALUES($1,$2) RETURNING id ",
            [patient[0]?.id, handler],
          );
          await client.query(
            "UPDATE patients SET reason_for_appointment = $2 WHERE id=$1",
            [patient[0]?.id, reasonForAppointment],
          );*/

          booking = await db
            .insert(bookings)
            .values({
              patientId: patient?.[0]?.id,
              doctorHandler: parseInt(handler as string),

              reasonForAppointMent: reasonForAppointment as string,
              nurseVisit: nurseVisit,
              prescriptionRequest: prescriptionRequest,
              medicalExamRequest: medicalExamRequest,
              labTestRequest: labTestRequest,
            })
            .returning();
          break;
        case "clinic":
          /*booking = await client.query(
            "INSERT INTO bookings(patient_id,clinic_handler) VALUES($1,$2,$3) RETURNING id ",
            [patient[0]?.id, handler],
          );
          await client.query(
            "UPDATE patients SET reason_for_appointment = $2 WHERE id=$1",
            [patient[0]?.id, reasonForAppointment],
          );*/

          booking = await db
            .insert(bookings)
            .values({
              patientId: patient?.[0]?.id,
              clinicHandler: parseInt(handler as string),

              reasonForAppointMent: reasonForAppointment as string,
              nurseVisit: nurseVisit,
              prescriptionRequest: prescriptionRequest,
              medicalExamRequest: medicalExamRequest,
              labTestRequest: labTestRequest,
            })
            .returning();
          break;
        default:
          return new Response("Error matching roles", { status: 404 });
      }
    } else {
      return new Response("Form data submitted is null", { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (booking[0]?.id) {
      return Response.json({ status: "Booking Created" });
    } else {
      return Response.json({ status: "Error creating booking" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ status: "An internal error occured" });
  }
}
