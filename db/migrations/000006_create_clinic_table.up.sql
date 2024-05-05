CREATE TABLE IF NOT EXISTS clinics
(
  id SERIAL,
  name VARCHAR(255) NOT NULL, 
  license_document_link VARCHAR(255) NOT NULL, 
  services JSONB, 
  phoneNumber VARCHAR(15) NOT NULL,
  location VARCHAR(255) NOT NULL, 
  userId INT,
  CONSTRAINT fk_User FOREIGN KEY(userId) REFERENCES users(id), 

  PRIMARY KEY (id)
)
