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
  date,
} from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    productId: serial("product_id").primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    dosage: text("dosage").array(),
    averagePrice: real("average_price").notNull(),
    manufacturer: text("manufacturer").notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
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
  topProduct: boolean("top_product").default(false),
  price: real("price").notNull(),
  productUrl: varchar("product_url", { length: 255 }),
});

export const labs = pgTable("labs", {
  id: serial("id").primaryKey().notNull(),
  estname: varchar("estname", { length: 255 }).notNull(),
  practiceLicenseNumber: varchar("practice_license_number", {
    length: 255,
  }).notNull(),

  verified: boolean("verified").default(false),

  validTill: date("valid_till"),
  services: jsonb("services"),
  phonenumber: varchar("phonenumber", { length: 15 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  userid: integer("userid").references(() => users.id),
});
export const adBanner = pgTable("ad_banners", {
  id: serial("id").primaryKey().notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  productLink: varchar("product_url", { length: 255 }).notNull(),
});
export const pharmacy = pgTable("pharmacy", {
  id: serial("id").primaryKey().notNull(),
  estname: varchar("estname", { length: 255 }).notNull(),
  phonenumber: varchar("phonenumber", { length: 15 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  userid: integer("userid").references(() => users.id),
  verified: boolean("verified").default(false),
  facilityRegistrationNumber: varchar("facility_registration_number"),
  licenseNumber: varchar("license_number"),
  validTill: date("valid_till"),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey().notNull(),
  phonenumber: varchar("phonenumber", { length: 15 }).notNull(),
  userId: integer("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  numberOfVisits: integer("number_of_visits").default(0),
});

export const patientVitalsRecords = pgTable("patient_vitals_records", {
  id: serial("id").primaryKey().notNull(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.id),
  height: real("height"),
  weight: real("weight"),
  BMI: real("BMI"),
  temperature: real("temperature"),
  blood_pressure: real("blood_pressure"),
  resp: real("resp"),
  physicianNotes: jsonb("physician_notes"),
  notes: text("notes"),
  allergies: text("allergies").array(),
  medication: text("medication").array(),
  vaccinations: text("vaccinations").array(),
  lifestyleTypeScreening: text("lifestyle_type_screening"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
  requestNurseVisit: boolean("nurse_visit"),
  reasonForAppointMent: text("reason_for_appointment"),
  prescriptionRequest: boolean("prescription_request"),
  medicalExamRequest: boolean("medical_exam_request"),
  labTestRequest: boolean("lab_test_request"),
  processed: boolean("processed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
  verified: boolean("verified").default(false),
  practiceLicenseNumber: varchar("practiceLicenseNumber"),
  userid: integer("userid").references(() => users.id),
  validTill: date("valid_till"),
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
  practiceLicenseNumber: varchar("practice_license_number", {
    length: 255,
  }).notNull(),

  validTill: date("valid_till"),
  verified: boolean("verified").default(false),
  userid: integer("userid").references(() => users.id),
});

export const nurse = pgTable("nurse", {
  id: serial("id").primaryKey().notNull(),
  firstname: varchar("firstname", { length: 255 }),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  phonenumber: varchar("phonenumber", { length: 15 }).notNull(),
  countyofpractice: varchar("countyofpractice", { length: 255 }).notNull(),
  practiceLicenseNumber: varchar("practice_license_number", {
    length: 255,
  }).notNull(),
  verified: boolean("verified").default(false),
  validTill: date("valid_till"),
  userid: integer("userid").references(() => users.id),
});

export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey().notNull(),
  estname: varchar("estname", { length: 255 }).notNull(),
  practiceLicenseNumber: varchar("practice_license_number", {
    length: 255,
  }).notNull(),
  services: jsonb("services"),

  validTill: date("valid_till"),
  phonenumber: varchar("phonenumber", { length: 15 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  userid: integer("userid").references(() => users.id),

  verified: boolean("verified").default(false),
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
