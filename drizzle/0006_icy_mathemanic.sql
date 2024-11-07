CREATE TABLE IF NOT EXISTS "ad_banner" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
