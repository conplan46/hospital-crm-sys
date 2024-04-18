 CREATE TABLE IF NOT EXISTS patients
 (
  id SERIAL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(15) NOT NULL,
  userId ID,
  CONSTRAINT fk_User FOREIGN KEY(userId) REFERENCES users(id),

  PRIMARY KEY (id)
 )
