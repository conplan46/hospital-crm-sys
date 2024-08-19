ALTER TABLE "inventory" DROP CONSTRAINT "fk_product";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "clinics_bookings_handler_foreign";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "clinicians_bookings_handler_foreign";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "doctors_bookings_handler_foreign";
--> statement-breakpoint
ALTER TABLE "labs" DROP CONSTRAINT "fk_user";
--> statement-breakpoint
ALTER TABLE "pharmacy" DROP CONSTRAINT "fk_user";
--> statement-breakpoint
ALTER TABLE "patients" DROP CONSTRAINT "fk_user";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "fk_role";
--> statement-breakpoint
ALTER TABLE "clinicians" DROP CONSTRAINT "fk_user";
--> statement-breakpoint
ALTER TABLE "doctors" DROP CONSTRAINT "fk_user";
--> statement-breakpoint
ALTER TABLE "clinics" DROP CONSTRAINT "fk_user";
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "patient_id" bigint;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "reason_for_appointment" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "height" real;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "weight" real;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "BMI" real;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "temperature" real;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "blood_pressure" real;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "resp" real;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "notes" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_clinic_handler_clinics_id_fk" FOREIGN KEY ("clinic_handler") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_clinician_handler_clinicians_id_fk" FOREIGN KEY ("clinician_handler") REFERENCES "public"."clinicians"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_doctor_handler_doctors_id_fk" FOREIGN KEY ("doctor_handler") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labs" ADD CONSTRAINT "labs_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pharmacy" ADD CONSTRAINT "pharmacy_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_userrole_roles_role_fk" FOREIGN KEY ("userrole") REFERENCES "public"."roles"("role") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinicians" ADD CONSTRAINT "clinicians_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinics" ADD CONSTRAINT "clinics_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
