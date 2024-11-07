CREATE TABLE IF NOT EXISTS pharmacy
(
  id SERIAL,
  license_document_link VARCHAR(255) NOT NULL, 
  estname VARCHAR(255) NOT NULL, 
  phoneNumber VARCHAR(15) NOT NULL,
  location VARCHAR(255) NOT NULL, 
  userId INT,
  CONSTRAINT fk_User FOREIGN KEY(userId) REFERENCES users(id), 

  PRIMARY KEY (id)
)
