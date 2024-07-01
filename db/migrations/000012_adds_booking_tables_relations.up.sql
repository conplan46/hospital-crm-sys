
CREATE TABLE bookings(
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    mobileNumber TEXT NOT NULL,
    handler BIGINT NOT NULL,

    CONSTRAINT clinics_bookings_handler_foreign FOREIGN KEY(handler) REFERENCES clinics(id),
    CONSTRAINT clinicians_bookings_handler_foreign FOREIGN KEY(handler) REFERENCES clinicians(id),
    CONSTRAINT doctors_bookings_handler_foreign FOREIGN KEY(handler) REFERENCES doctors(id),
    PRIMARY KEY(id)
);
