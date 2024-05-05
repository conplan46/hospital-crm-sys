export type Clinicians = Array<Clinician>
export type Clinician = { id: number, firstname: string, lastname: string, phonenumber: string, primaryareaofspeciality: string, countyofpractice: string, userid: number }
export type Patients = Array<Patient>
export type Patient = { id: number, firstname: string, lastname: string, phonenumber: string, userid: number }
export type User = { id: number, name: string, email: string, password: string, image: string, emailverified: string };
export type CreateClinicReturnType = "clinic added" | "An internal error adding the clinic" | "Corresponding user does not exist";
