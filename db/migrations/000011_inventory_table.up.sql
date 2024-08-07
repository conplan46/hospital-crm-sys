CREATE TABLE IF NOT EXISTS products
(
    product_id SERIAL NOT NULL,
		name TEXT NOT NULL,		
		description TEXT NOT NULL,
		UNIQUE(name),

    PRIMARY KEY(product_id)

);

CREATE TABLE IF NOT EXISTS inventory
(

    id SERIAL NOT NULL,
    product_id BIGINT NOT NULL,
    est_id BIGINT NOT NULL,
    inventory_count BIGINT NOT NULL,

		CONSTRAINT fk_Product FOREIGN KEY(product_id) REFERENCES products(product_id),

    PRIMARY KEY(id)

);


