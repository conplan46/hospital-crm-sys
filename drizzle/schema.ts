import {
  pgTable,
  unique,
  serial,
  text,
  foreignKey,
  bigint,
  varchar,
  jsonb,
  integer,
  boolean,
  timestamp,
  primaryKey,
  decimal,
  real,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { pool } from "utils/db-pool";
import { drizzle } from "drizzle-orm/node-postgres";


export const products = pgTable(
  "products",
  {
    productId: serial("product_id").primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      productsNameKey: unique("products_name_key").on(table.name),
    };
  },
);

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  productId: bigint("product_id", { mode: "number" })
    .notNull()
    .references(() => products.productId),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  estId: bigint("est_id", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  inventoryCount: bigint("inventory_count", { mode: "number" }).notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  clinicHandler: bigint("clinic_handler", { mode: "number" }).references(
    () => clinics.id,
  ),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  clinicianHandler: bigint("clinician_handler", { mode: "number" }).references(
    () => clinicians.id,
  ),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  doctorHandler: bigint("doctor_handler", { mode: "number" }).references(
    () => doctors.id,
  ),
  patientId: bigint("patient_id", { mode: "number" }).references(
    () => patients.id,
  ),
});

export const labs = pgTable("labs", {
  id: serial("id").primaryKey().notNull(),
  estname: varchar("estname", { length: 255 }).notNull(),
  licenseDocumentLink: varchar("license_document_link", {
    length: 255,
  }).notNull(),
  services: jsonb("services"),
  phonenumber: varchar("phonenumber", { length: 15 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  userid: integer("userid").references(() => users.id),
});

export const pharmacy = pgTable("pharmacy", {
  id: serial("id").primaryKey().notNull(),
  licenseDocumentLink: varchar("license_document_link", {
    length: 255,
  }).notNull(),
  estname: varchar("estname", { length: 255 }).notNull(),
  phonenumber: varchar("phonenumber", { length: 15 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  userid: integer("userid").references(() => users.id),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey().notNull(),
  phonenumber: varchar("phonenumber", { length: 15 }).notNull(),
  userid: integer("userid").references(() => users.id),
  prescriptionRequest: text("prescription_request"),
  medicalExamRequest: boolean("medical_exam_request"),
  nurseVisit: boolean("nurse_visit"),
  patientComplaint: text("patient_complaint"),
  doctor: text("doctor"),
  labTestRequest: boolean("lab_test_request"),
  name: varchar("name", { length: 255 }).notNull(),
  processed: boolean("processed").default(false),
  reasonForAppointMent: text("reason_for_appointment"),
  height: real("height"),
  weight: real("weight"),
  BMI: real("BMI"),
  temperature: real("temperature"),
  blood_pressure: real("blood_pressure"),
  resp: real("resp"),
  notes: text("notes"),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("userId").notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  expiresAt: bigint("expires_at", { mode: "number" }),
  idToken: text("id_token"),
  scope: text("scope"),
  sessionState: text("session_state"),
  tokenType: text("token_type"),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("userId").notNull(),
  expires: timestamp("expires", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  sessionToken: varchar("sessionToken", { length: 255 }).notNull(),
});

export const roles = pgTable("roles", {
  role: text("role").primaryKey().notNull(),
});

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    password: varchar("password", { length: 255 }),
    emailVerified: timestamp("emailVerified", {
      withTimezone: true,
      mode: "string",
    }),
    image: text("image"),
    userrole: text("userrole").references(() => roles.role),
  },
  (table) => {
    return {
      usersEmailKey: unique("users_email_key").on(table.email),
    };
  },
);

export const clinicians = pgTable("clinicians", {
  id: serial("id").primaryKey().notNull(),
  firstname: varchar("firstname", { length: 255 }),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  phonenumber: varchar("phonenumber", { length: 15 }).notNull(),
  primaryareaofspeciality: varchar("primaryareaofspeciality", {
    length: 255,
  }).notNull(),
  countyofpractice: varchar("countyofpractice", { length: 255 }).notNull(),
  licenseDocumentLink: varchar("license_document_link", {
    length: 255,
  }).notNull(),
  userid: integer("userid").references(() => users.id),
});

export const schemaMigrations = pgTable("schema_migrations", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  version: bigint("version", { mode: "number" }).primaryKey().notNull(),
  dirty: boolean("dirty").notNull(),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey().notNull(),
  firstname: varchar("firstname", { length: 255 }),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  phonenumber: varchar("phonenumber", { length: 15 }).notNull(),
  primaryareaofspeciality: varchar("primaryareaofspeciality", {
    length: 255,
  }).notNull(),
  countyofpractice: varchar("countyofpractice", { length: 255 }).notNull(),
  licenseDocumentLink: varchar("license_document_link", {
    length: 255,
  }).notNull(),
  userid: integer("userid").references(() => users.id),
});

export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey().notNull(),
  estname: varchar("estname", { length: 255 }).notNull(),
  licenseDocumentLink: varchar("license_document_link", {
    length: 255,
  }).notNull(),
  services: jsonb("services"),
  phonenumber: varchar("phonenumber", { length: 15 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  userid: integer("userid").references(() => users.id),
});

export const verificationToken = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    expires: timestamp("expires", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    token: text("token").notNull(),
  },
  (table) => {
    return {
      verificationTokenPkey: primaryKey({
        columns: [table.identifier, table.token],
        name: "verification_token_pkey",
      }),
    };
  },
);
