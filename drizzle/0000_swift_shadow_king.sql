-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE TABLE IF NOT EXISTS "products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "products_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" bigint NOT NULL,
	"est_id" bigint NOT NULL,
	"inventory_count" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"mobilenumber" text NOT NULL,
	"clinic_handler" bigint,
	"clinician_handler" bigint,
	"doctor_handler" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labs" (
	"id" serial PRIMARY KEY NOT NULL,
	"estname" varchar(255) NOT NULL,
	"license_document_link" varchar(255) NOT NULL,
	"services" jsonb,
	"phonenumber" varchar(15) NOT NULL,
	"location" varchar(255) NOT NULL,
	"userid" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pharmacy" (
	"id" serial PRIMARY KEY NOT NULL,
	"license_document_link" varchar(255) NOT NULL,
	"estname" varchar(255) NOT NULL,
	"phonenumber" varchar(15) NOT NULL,
	"location" varchar(255) NOT NULL,
	"userid" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"phonenumber" varchar(15) NOT NULL,
	"userid" integer,
	"prescription_request" text,
	"medical_exam_request" boolean,
	"nurse_visit" boolean,
	"patient_complaint" text,
	"doctor" text,
	"lab_test_request" boolean,
	"name" varchar(255) NOT NULL,
	"processed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" bigint,
	"id_token" text,
	"scope" text,
	"session_state" text,
	"token_type" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"sessionToken" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"role" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"password" varchar(255),
	"emailVerified" timestamp with time zone,
	"image" text,
	"userrole" text,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinicians" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar(255),
	"lastname" varchar(255) NOT NULL,
	"phonenumber" varchar(15) NOT NULL,
	"primaryareaofspeciality" varchar(255) NOT NULL,
	"countyofpractice" varchar(255) NOT NULL,
	"license_document_link" varchar(255) NOT NULL,
	"userid" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schema_migrations" (
	"version" bigint PRIMARY KEY NOT NULL,
	"dirty" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doctors" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar(255),
	"lastname" varchar(255) NOT NULL,
	"phonenumber" varchar(15) NOT NULL,
	"primaryareaofspeciality" varchar(255) NOT NULL,
	"countyofpractice" varchar(255) NOT NULL,
	"license_document_link" varchar(255) NOT NULL,
	"userid" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinics" (
	"id" serial PRIMARY KEY NOT NULL,
	"estname" varchar(255) NOT NULL,
	"license_document_link" varchar(255) NOT NULL,
	"services" jsonb,
	"phonenumber" varchar(15) NOT NULL,
	"location" varchar(255) NOT NULL,
	"userid" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	CONSTRAINT "verification_token_pkey" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "fk_product" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "clinics_bookings_handler_foreign" FOREIGN KEY ("clinic_handler") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "clinicians_bookings_handler_foreign" FOREIGN KEY ("clinician_handler") REFERENCES "public"."clinicians"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "doctors_bookings_handler_foreign" FOREIGN KEY ("doctor_handler") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labs" ADD CONSTRAINT "fk_user" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pharmacy" ADD CONSTRAINT "fk_user" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "fk_user" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "fk_role" FOREIGN KEY ("userrole") REFERENCES "public"."roles"("role") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinicians" ADD CONSTRAINT "fk_user" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctors" ADD CONSTRAINT "fk_user" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinics" ADD CONSTRAINT "fk_user" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


