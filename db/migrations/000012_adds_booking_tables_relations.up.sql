
CREATE TABLE bookings(
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    mobileNumber TEXT NOT NULL,
    clinic_handler BIGINT NULL,
    clinician_handler BIGINT NULL,
    doctor_handler BIGINT NULL,

    CONSTRAINT clinics_bookings_handler_foreign FOREIGN KEY(clinic_handler) REFERENCES clinics(id),
    CONSTRAINT clinicians_bookings_handler_foreign FOREIGN KEY(clinician_handler) REFERENCES clinicians(id),
    CONSTRAINT doctors_bookings_handler_foreign FOREIGN KEY(doctor_handler) REFERENCES doctors(id),
    PRIMARY KEY(id)
);
