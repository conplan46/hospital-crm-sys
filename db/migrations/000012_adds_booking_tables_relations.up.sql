
CREATE TABLE bookings(
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    mobileNumber TEXT NOT NULL,
    clinicHandler BIGINT,
    clinicianHandler BIGINT,
    doctorHandler BIGINT,

    CONSTRAINT clinics_bookings_handler_foreign FOREIGN KEY(clinicHandler) REFERENCES clinics(id),
    CONSTRAINT clinicians_bookings_handler_foreign FOREIGN KEY(clinicianHandler) REFERENCES clinicians(id),
    CONSTRAINT doctors_bookings_handler_foreign FOREIGN KEY(doctorHandler) REFERENCES doctors(id),
    PRIMARY KEY(id)
);
