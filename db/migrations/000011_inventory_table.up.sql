CREATE TABLE IF NOT EXISTS products
(
    id SERIAL NOT NULL,
		name TEXT NOT NULL,		
		description TEXT NOT NULL,
		UNIQUE(name),

    PRIMARY KEY(id)

);

CREATE TABLE IF NOT EXISTS inventory
(

    id SERIAL NOT NULL,
    product_id BIGINT NOT NULL,
    est_id BIGINT NOT NULL,
    inventory_count BIGINT NOT NULL,

		CONSTRAINT fk_Product FOREIGN KEY(product_id) REFERENCES products(id),

    PRIMARY KEY(id)

);


