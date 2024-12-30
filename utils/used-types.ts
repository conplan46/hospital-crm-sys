import {
  clinicians,
  clinics,
  doctors,
  patients,
  pharmacy,
  users,
} from "drizzle/schema";
import { z } from "zod";
import { Prisma } from "@prisma/client";
const userWithData = Prisma.validator<Prisma.usersDefaultArgs>()({
  include: {
    pharmacy: true,
    patients: true,
    clinics: true,
    doctors: true,
    nurse: true,
    clinicians: true,
    labs: true,
  },
});
const pharmaciesInd = Prisma.validator<Prisma.pharmacyFindManyArgs>()({
  include: { users: true },
});

const doctorsWithUsersInd = Prisma.validator<Prisma.doctorsFindManyArgs>()({
  include: { users: true },
});
const labsInd = Prisma.validator<Prisma.labsFindManyArgs>()({});

const labsWithUsersInd = Prisma.validator<Prisma.labsFindManyArgs>()({
  include: { users: true },
});
const clinicsInd = Prisma.validator<Prisma.clinicsFindManyArgs>()({});
const cliniciansInd = Prisma.validator<Prisma.cliniciansFindManyArgs>()({});

const cliniciansWithUsersInd =
  Prisma.validator<Prisma.cliniciansFindManyArgs>()({
    include: { users: true },
  });
const doctorsInd = Prisma.validator<Prisma.doctorsFindManyArgs>()({});
const productInd = Prisma.validator<Prisma.productsFindManyArgs>()({});
const findProduct = Prisma.validator<Prisma.productsFindUniqueArgs>()({});
const topProductsWithInv = Prisma.validator<Prisma.inventoryFindManyArgs>()({
  include: { products: true },
});
export type topProductsWithInvDataType = Prisma.inventoryGetPayload<
  typeof topProductsWithInv
>;
export type getPharmaciesWithUsers = Prisma.pharmacyGetPayload<
  typeof pharmaciesInd
>;
export type findProductDataType = Prisma.productsGetPayload<typeof findProduct>;
export type productsDataType = Prisma.productsGetPayload<typeof productInd>;
export type doctorsDataType = Prisma.doctorsGetPayload<typeof doctorsInd>;

export type doctorsWithUsersDataType = Prisma.doctorsGetPayload<
  typeof doctorsWithUsersInd
>;
export type cliniciansDataType = Prisma.cliniciansGetPayload<
  typeof cliniciansInd
>;

export type clinicianswithUsersDataType = Prisma.cliniciansGetPayload<
  typeof cliniciansWithUsersInd
>;
export type clinicsDataType = Prisma.clinicsGetPayload<typeof clinicsInd>;
export type UserWithDataType = Prisma.usersGetPayload<typeof userWithData>;
export type labsDataType = Prisma.labsGetPayload<typeof labsInd>;

export type labsWithUsersDataType = Prisma.labsGetPayload<
  typeof labsWithUsersInd
>;
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
  reason_for_appointment: string;
  height: number;
  weight: number;
  BMI: number;
  temperature: number;
  blood_pressure: number;
  resp: number;
  notes: string;
}
export interface DrugPurchaseForm {
  inventory_id: number;
  amount: number;
  quantity: number;
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

export interface Lab {
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
export type Product = {
  product_id: number;
  name: string;
  description: string;
};
export interface ClinicData extends User, Clinic {}
export interface PharmacyData extends User, Pharmacy {}
export interface DoctorData extends User, Doctor {}
export interface PatientData extends User, Patient {}
export interface ClinicianData extends User, Clinician {}
export interface LabData extends User, Lab {}
export type UserData =
  | ClinicData
  | PharmacyData
  | DoctorData
  | PatientData
  | LabData
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
export type UserDataDrizzle =
  | Array<{
      users: typeof users.$inferSelect;
      clinics?: typeof clinics.$inferSelect;
      clinicians?: typeof clinicians.$inferSelect;
      doctors?: typeof doctors.$inferSelect;
      pharmacy?: typeof pharmacy.$inferSelect;
      patients?: typeof patients.$inferSelect;
    }>
  | undefined;
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
  practicingLicenseNumber: z.string(),
});
export type ClinicianDataForm = z.infer<typeof clinicianOnboardingSchema>;
const clinicOnboardingDataSchema = z.object({
  phoneNumber: z.string(),
  location: z.string(),
  businessName: z.string(),
  practicingLicense: z.custom<FileList>().nullish(),
});
export type ClinicDataForm = z.infer<typeof clinicOnboardingDataSchema>;

const labOnboardingDataSchema = z.object({
  phoneNumber: z.string(),
  location: z.string(),
  businessName: z.string(),
  practicingLicense: z.custom<FileList>().nullish(),
});
export type LabDataForm = z.infer<typeof labOnboardingDataSchema>;
const doctorOnboardingDataSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  primaryAreaOfSpeciality: z.string(),
  location: z.string(),
  countyOfPractice: z.string(),
  practicingLicense: z.string(),
});

const nurseOnboardingDataSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  primaryAreaOfSpeciality: z.string(),
  location: z.string(),
  countyOfPractice: z.string(),
  practicingLicenseNumber: z.string(),
});
const bannerObj = z.object({
  banner: z.custom<FileList>().nullish(),
});
export type NurseDataForm = z.infer<typeof nurseOnboardingDataSchema>;
export type BannerForm = z.infer<typeof bannerObj>;
export type DoctorDataForm = z.infer<typeof doctorOnboardingDataSchema>;
export type PharmacyDataForm = z.infer<typeof pharmacyOnboardingDataSchema>;
const pharmacyOnboardingDataSchema = z.object({
  phoneNumber: z.string(),
  location: z.string(),
  businessName: z.string(),
  facilityRegistrationNumber: z.string(),
  licenseNumber: z.string(),
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
const patientRegistration = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
});
const bookingDataSchema = z.object({
  patientEmail: z.string().email(),
  reasonForAppointment: z.string(),
  prescriptionRequest: z.boolean(),
  medicalExamRequest: z.boolean(),
  labTestRequest: z.boolean(),
  handler: z.number(),
});
const inventoryItemSchema = z.object({
  productTitle: z.string(),
  productDescription: z.string(),
  inventoryCount: z.number(),
  productManufacturer: z.string(),
  dosages: z.string(),
  price: z.number(),

  drugImage: z.custom<FileList>().nullish(),
});
export interface IInventoryItem {
  id: number;
  product_id: number;
  name: string;
  inventory_count: string;
  est_id: number;
  description: string;
}
export interface Booking {
  id: number;
  name: string;
  mobilenumber: string;
  handler: number;
}
export type AddInvItem = z.infer<typeof inventoryItemSchema>;
export type PatientBookingFormData = z.infer<typeof patientBookingDataSchema>;
export type PatientRegistrationForm = z.infer<typeof patientRegistration>;
export type BookingFormData = z.infer<typeof bookingDataSchema>;
