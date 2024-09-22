/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { eq } from "drizzle-orm";
import { patientVitalsRecords, patients } from "drizzle/schema";
import { db } from "utils/db-pool";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const bloodPressure = data.get("bloodPressure");
    const temperature = data.get("temperature");
    const resp = data.get("resp");
    const patientId = Number(data.get("id"));
    const height = Number(data.get("height"));
    const weight = Number(data.get("weight"));
    const allergies: Array<string> = JSON.parse(
      data.get("allergies") as string,
    );
    const medications: Array<string> = JSON.parse(
      data.get("medications") as string,
    );
    console.log({ data });
    const vaccinations: Array<string> = JSON.parse(
      data.get("vaccinations") as string,
    );
    const allergiesArray = allergies?.toString().split(",");
    const medicationsArray = medications?.toString().split(",");
    const vaccinationsArray = vaccinations?.toString().split(",");
    const patientWithVitals = await db
      .insert(patientVitalsRecords)
      .values({
        blood_pressure: Number(bloodPressure),
        temperature: Number(temperature),
        weight: weight,
        height: height,
        resp: Number(resp),
        BMI: weight / Math.pow(height, 2),
        medication: medicationsArray,
        allergies: allergiesArray,
        vaccinations: vaccinationsArray,
        patientId: patientId,
      })
      .returning({ id: patients.id });
    if (patientWithVitals[0]?.id == patientId) {
      return Response.json({ status: "updated successfully" });
    } else {
      return Response.json({ status: "error updating" });
    }
  } catch (e) {
    console.error(e);

    return new Response("An internal error occured", { status: 404 });
  }
}
