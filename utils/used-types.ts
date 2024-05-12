export type Clinicians = Array<Clinician>
export interface Clinician { id: number, firstname: string, lastname: string, phonenumber: string, primaryareaofspeciality: string, countyofpractice: string, userid: number }
export type Patients = Array<Patient>
export interface Patient { id: number, firstname: string, lastname: string, phonenumber: string, userid: number }
export interface User { id: number; userrole: string; name: string; email: string; password: string; image: string; emailverified: string; }
export type CreateClinicReturnType = "clinic added" | "An internal error adding the clinic" | "Corresponding user does not exist";
export interface Doctor { id: number, firstname: string, lastname: string, phonenumber: string, primaryareaofspeciality: string, countyofpractice: string, userid: number }
export interface Clinic { id: number, estname: string, phonenumber: string, license_document_link: string, services: string, location: string, userid: number }
export interface Pharmacy { id: number, estname: string, phonenumber: string, license_document_link: string, services: string, location: string, userid: number }
export interface ClinicData extends User, Clinic { };
export interface PharmacyData extends User, Pharmacy { };
export interface DoctorData extends User, Doctor { };
export interface PatientData extends User, Patient { };
export interface ClinicianData extends User, Clinician { };
export type UserData = ClinicData | PharmacyData | DoctorData | PatientData | ClinicianData;
type CommonKeys<T extends object> = keyof T;
type AllKeys<T> = T extends any ? keyof T : never;

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
	? T[K]
	: undefined;
type Subtract<A, C> = A extends C ? never : A;
type NonCommonKeys<T extends object> = Subtract<AllKeys<T>, CommonKeys<T>>;
type Merge<T extends object> = {
	[k in CommonKeys<T>]: PickTypeOf<T, k>;
} &
	{
		[k in NonCommonKeys<T>]?: PickTypeOf<T, k>;
	};

type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T>
	? PickType<T, K>
	: never;

export type UserDataAl = Merge<UserData>
