ALTER TABLE "patients" ALTER COLUMN "notes" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "allergies" text[];--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "number_of_visits" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "medication" text[];--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "vaccinations" text[];--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "lifestyle_type_screening" text;