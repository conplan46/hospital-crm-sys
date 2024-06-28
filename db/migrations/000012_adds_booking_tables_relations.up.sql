
CREATE TABLE bookings(
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    mobileNumber TEXT NOT NULL,
    handler BIGINT NOT NULL,
    PRIMARY KEY(id)
);

ALTER TABLE
    bookings ADD CONSTRAINT bookings_handler_foreign FOREIGN KEY(handler) REFERENCES clinics(id);
ALTER TABLE
    bookings ADD CONSTRAINT bookings_handler_foreign FOREIGN KEY(handler) REFERENCES clinicians(id);
ALTER TABLE
    bookings ADD CONSTRAINT bookings_handler_foreign FOREIGN KEY(handler) REFERENCES doctors(id);
