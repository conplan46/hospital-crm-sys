CREATE TABLE IF NOT EXISTS "inventory"(
    "product_name" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "est_id" BIGINT NOT NULL,
    "inventory_count" BIGINT NOT NULL,
		"product_description" TEXT NOT NULL,
    CONSTRAINT fk_Pharmacy FOREIGN KEY("est_id") REFERENCES pharmacy(id),
		UNIQUE("product_name"),
    PRIMARY KEY("id")

);

