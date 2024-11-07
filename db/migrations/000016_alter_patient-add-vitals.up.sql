ALTER TABLE patients ADD reason_for_appointment TEXT;
ALTER TABLE patients ADD height DECIMAL(8, 2) NULL;
ALTER TABLE patients ADD weight DECIMAL(8, 2) NULL;
ALTER TABLE patients ADD BMI DECIMAL(8, 2) NULL; 
ALTER TABLE patients ADD temperature DECIMAL(8, 2) NULL; 
ALTER TABLE patients ADD blood_pressure DECIMAL(8, 2) NULL;
ALTER TABLE patients ADD resp  DECIMAL(8, 2) NULL;
ALTER TABLE patient ADD notes TEXT NOT NULL;
ALTER TABLE bookings ADD patient_id BIGINT;
ALTER TABLE bookings ADD CONSTRAINT bookings_patientid_foreign FOREIGN KEY(patient_id) REFERENCES patients(id);





