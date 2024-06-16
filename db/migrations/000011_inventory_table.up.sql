CREATE TABLE IF NOT EXISTS "inventory"(

    "id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "est_id" BIGINT NOT NULL,
    "inventory_count" BIGINT NOT NULL,
		"product_description" TEXT,

		CONSTRAINT fk_ProductName FOREIGN KEY("product_name") REFERENCES products(name),
		CONSTRAINT fk_ProductDescription FOREIGN KEY("product_description") REFERENCES products(description),
    CONSTRAINT fk_Pharmacy FOREIGN KEY("est_id") REFERENCES pharmacy(id),
    PRIMARY KEY("id")

);
CREATE TABLE IF NOT EXISTS products(
    id SERIAL NOT NULL,
		name TEXT NOT NULL,		
		description TEXT NOT NULL,

		UNIQUE(name),

)

