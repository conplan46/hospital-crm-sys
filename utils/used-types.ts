import { z } from "zod";

export type Clinicians = Array<Clinician>;
export interface Clinician {
  id: number;
  firstname: string;
  lastname: string;
  phonenumber: string;
  primaryareaofspeciality: string;
  countyofpractice: string;
  userid: number;
}
export interface Product {
  id: number;
  name: string;
  desc: string;
}
export type Patients = Array<Patient>;
export interface Patient {
  id: number;
  name: string;
  phonenumber: string;
  userid: number;
  prescription_request: string;
  medical_exam_request: boolean;
  nurse_visit: boolean;
  patient_complaint: string;
  doctor: string;
  lab_test_request: boolean;
}
export interface User {
  id: number;
  userrole: string;
  name: string;
  email: string;
  password: string;
  image: string;
  emailverified: string;
}
export type CreateClinicReturnType =
  | "clinic added"
  | "An internal error adding the clinic"
  | "Corresponding user does not exist";
export interface Doctor {
  id: number;
  firstname: string;
  lastname: string;
  phonenumber: string;
  primaryareaofspeciality: string;
  countyofpractice: string;
  userid: number;
}
export interface Clinic {
  id: number;
  estname: string;
  phonenumber: string;
  license_document_link: string;
  services: Array<string>;
  location: string;
  userid: number;
}
export interface Pharmacy {
  id: number;
  estname: string;
  phonenumber: string;
  license_document_link: string;
  services: string;
  location: string;
  userid: number;
}
export interface ClinicData extends User, Clinic {}
export interface PharmacyData extends User, Pharmacy {}
export interface DoctorData extends User, Doctor {}
export interface PatientData extends User, Patient {}
export interface ClinicianData extends User, Clinician {}
export type UserData =
  | ClinicData
  | PharmacyData
  | DoctorData
  | PatientData
  | ClinicianData;
type CommonKeys<T extends object> = keyof T;
type AllKeys<T> = T extends any ? keyof T : never;

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
  ? T[K]
  : undefined;
type Subtract<A, C> = A extends C ? never : A;
type NonCommonKeys<T extends object> = Subtract<AllKeys<T>, CommonKeys<T>>;
type Merge<T extends object> = {
  [k in CommonKeys<T>]: PickTypeOf<T, k>;
} & {
  [k in NonCommonKeys<T>]?: PickTypeOf<T, k>;
};

type PickTypeOf<T, K extends string | number | symbol> =
  K extends AllKeys<T> ? PickType<T, K> : never;

export type UserDataAl = Merge<UserData>;
const clinicianOnboardingSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  primaryAreaOfSpeciality: z.string(),
  location: z.string(),
  countyOfPractice: z.string(),
  practicingLicense: z.custom<FileList>().nullish(),
});
export type ClinicianDataForm = z.infer<typeof clinicianOnboardingSchema>;
const clinicOnboardingDataSchema = z.object({
  phoneNumber: z.string(),
  location: z.string(),
  businessName: z.string(),
  practicingLicense: z.custom<FileList>().nullish(),
});
export type ClinicDataForm = z.infer<typeof clinicOnboardingDataSchema>;
const doctorOnboardingDataSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  primaryAreaOfSpeciality: z.string(),
  location: z.string(),
  countyOfPractice: z.string(),
  practicingLicense: z.custom<FileList>().nullish(),
});
export type DoctorDataForm = z.infer<typeof doctorOnboardingDataSchema>;
export type PharmacyDataForm = z.infer<typeof pharmacyOnboardingDataSchema>;
const pharmacyOnboardingDataSchema = z.object({
  phoneNumber: z.string(),
  location: z.string(),
  businessName: z.string(),
  practicingLicense: z.custom<FileList>().nullish(),
});
const patientBookingDataSchema = z.object({
  patientName: z.string(),
  doctor: z.string(),
  nurseVisit: z.boolean(),
  requestLabTest: z.boolean(),
  phoneNumber: z.string(),
  requestPrescription: z.string(),
  requestMedicalExam: z.boolean(),
  patientComplaint: z.string(),
});
const inventoryItemSchema = z.object({
  productTitle: z.string(),
  productDescription: z.string(),
  inventoryCount: z.number(),
});
export interface IInventoryItem {
  id: number;
  product_name: string;
  inventory_count: number;
  est_id: number;
  product_description: string;
}
export type AddInvItem = z.infer<typeof inventoryItemSchema>;
export type PatientBookingFormData = z.infer<typeof patientBookingDataSchema>;
