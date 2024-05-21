import { QueryResult } from "pg";
import { pool } from "utils/db-pool";
import { User } from "utils/used-types";
export async function POST(request: Request) {
	try {
		const data = await request.formData();
		const patientName = data.get("patientName");
		const doctor = data.get("doctor");
		const nurseVisit = data.get("nurseVisit");
		const requestLabTest = data.get("requestLabTest");
		const phoneNumber = data.get("phoneNumber");
		const requestPrescription = data.get("requestPrescription");
		const requestMedicalExam = data.get("requestMedicalExam");
		const patientComplaint = data.get("patientComplaint");
		console.log(data);
		const queryResult = await pool.query(
			"INSERT INTO patients(name,doctor,nurse_visit,lab_test_request,phonenumber,prescription_request,medical_exam_request,patient_complaint) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
			[
				patientName,
				doctor,
				nurseVisit,
				requestLabTest,
				phoneNumber,
				requestPrescription,
				requestMedicalExam,
				patientComplaint,
			],
		);
		if (queryResult.rowCount == 1) {
			return Response.json({ status: "patient added" });
		} else {
			return Response.json({
				status: "An internal error adding the patient",
			});
		}
	} catch (e) {
		console.error(e);
		return Response.json({ status: "An internal error occured" });
	}
}
