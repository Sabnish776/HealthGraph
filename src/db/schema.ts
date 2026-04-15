import { pgTable, text, timestamp, uuid, integer, boolean, varchar } from 'drizzle-orm/pg-core';

export const hospitals = pgTable('hospitals', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const patients = pgTable('patients', {
  id: uuid('id').primaryKey().defaultRandom(),
  mobile: varchar('mobile', { length: 15 }).notNull().unique(),
  name: text('name').notNull(),
  gender: varchar('gender', { length: 10 }),
  bloodGroup: varchar('blood_group', { length: 5 }),
  age: integer('age'),
  emergencyContact: text('emergency_contact'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const visits = pgTable('visits', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').references(() => patients.id).notNull(),
  hospitalId: uuid('hospital_id').references(() => hospitals.id).notNull(),
  date: timestamp('date').defaultNow(),
  reason: text('reason'),
  diagnosis: text('diagnosis'),
  notes: text('notes'),
});

export const medications = pgTable('medications', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').references(() => patients.id).notNull(),
  visitId: uuid('visit_id').references(() => visits.id),
  name: text('name').notNull(),
  dosage: text('dosage'),
  frequency: text('frequency'),
  status: varchar('status', { length: 20 }).default('active'), // active, revoked
  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date'),
});

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').references(() => patients.id).notNull(),
  visitId: uuid('visit_id').references(() => visits.id),
  title: text('title').notNull(),
  fileUrl: text('file_url'),
  contentSummary: text('content_summary'),
  date: timestamp('date').defaultNow(),
});

export const diseases = pgTable('diseases', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').references(() => patients.id).notNull(),
  name: text('name').notNull(),
  status: varchar('status', { length: 20 }).default('active'), // active, prone
  diagnosedAtVisitId: uuid('diagnosed_at_visit_id').references(() => visits.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const otps = pgTable('otps', {
  id: uuid('id').primaryKey().defaultRandom(),
  mobile: varchar('mobile', { length: 15 }).notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});
