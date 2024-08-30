ALTER TABLE "patients" ADD COLUMN "physician_notes" jsonb;--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN IF EXISTS "notes";