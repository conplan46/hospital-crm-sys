ALTER TABLE "inventory" ADD COLUMN "top_product" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "dosage" text[];--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "average_price" real NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "manufacturer" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "image_url" varchar(255) NOT NULL;