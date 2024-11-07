CREATE TABLE IF NOT EXISTS "patient_vitals_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"height" real,
	"weight" real,
	"BMI" real,
	"temperature" real,
	"blood_pressure" real,
	"resp" real,
	"physician_notes" jsonb,
	"notes" text,
	"allergies" text[],
	"medication" text[],
	"vaccinations" text[],
	"lifestyle_type_screening" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ad_banner" RENAME TO "ad_banners";--> statement-breakpoint
ALTER TABLE "patients" RENAME COLUMN "userid" TO "user_id";--> statement-breakpoint
ALTER TABLE "patients" DROP CONSTRAINT "patients_userid_users_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "nurse_visit" boolean;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "reason_for_appointment" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "prescription_request" boolean;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "medical_exam_request" boolean;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "lab_test_request" boolean;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "processed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_vitals_records" ADD CONSTRAINT "patient_vitals_records_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "prescription_request";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "medical_exam_request";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "nurse_visit";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "patient_complaint";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "doctor";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "lab_test_request";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "processed";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "reason_for_appointment";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "height";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "weight";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "BMI";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "temperature";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "blood_pressure";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "resp";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "physician_notes";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "notes";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "allergies";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "medication";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "vaccinations";--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "lifestyle_type_screening";