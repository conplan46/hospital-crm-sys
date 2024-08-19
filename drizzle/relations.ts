import { relations } from "drizzle-orm/relations";
import { products, inventory, clinics, bookings, clinicians, doctors, users, labs, pharmacy, patients, roles } from "./schema";

export const inventoryRelations = relations(inventory, ({one}) => ({
	product: one(products, {
		fields: [inventory.productId],
		references: [products.productId]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	inventories: many(inventory),
}));

export const bookingsRelations = relations(bookings, ({one}) => ({
	clinic: one(clinics, {
		fields: [bookings.clinicHandler],
		references: [clinics.id]
	}),
	clinician: one(clinicians, {
		fields: [bookings.clinicianHandler],
		references: [clinicians.id]
	}),
	doctor: one(doctors, {
		fields: [bookings.doctorHandler],
		references: [doctors.id]
	}),
}));

export const clinicsRelations = relations(clinics, ({one, many}) => ({
	bookings: many(bookings),
	user: one(users, {
		fields: [clinics.userid],
		references: [users.id]
	}),
}));

export const cliniciansRelations = relations(clinicians, ({one, many}) => ({
	bookings: many(bookings),
	user: one(users, {
		fields: [clinicians.userid],
		references: [users.id]
	}),
}));

export const doctorsRelations = relations(doctors, ({one, many}) => ({
	bookings: many(bookings),
	user: one(users, {
		fields: [doctors.userid],
		references: [users.id]
	}),
}));

export const labsRelations = relations(labs, ({one}) => ({
	user: one(users, {
		fields: [labs.userid],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	labs: many(labs),
	pharmacies: many(pharmacy),
	patients: many(patients),
	role: one(roles, {
		fields: [users.userrole],
		references: [roles.role]
	}),
	clinicians: many(clinicians),
	doctors: many(doctors),
	clinics: many(clinics),
}));

export const pharmacyRelations = relations(pharmacy, ({one}) => ({
	user: one(users, {
		fields: [pharmacy.userid],
		references: [users.id]
	}),
}));

export const patientsRelations = relations(patients, ({one}) => ({
	user: one(users, {
		fields: [patients.userid],
		references: [users.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	users: many(users),
}));