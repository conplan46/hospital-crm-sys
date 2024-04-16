CREATE TABLE IF NOT EXISTS clinicians
(
  id SERIAL,
  firstName VARCHAR(255),
  lastName VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(15) NOT NULL,
  primaryAreaOfSpeciality VARCHAR(255) NOT NULL,
  countyOfPractice VARCHAR(255) NOT NULL,
)
