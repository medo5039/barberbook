import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

// Re-export auth models
export * from "./models/auth";

// === TABLE DEFINITIONS ===

// Barber Profiles (extends users)
export const barbers = pgTable("barbers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => users.id),
  shopName: text("shop_name").notNull(),
  bio: text("bio"),
  location: text("location").notNull(), // e.g., "Berlin, Germany"
  address: text("address"),
  city: text("city"),
  country: text("country").default("Germany"),
  workingHours: jsonb("working_hours").$type<{
    [key: string]: { start: string; end: string; isOpen: boolean }
  }>(),
  isVerified: boolean("is_verified").default(false),
});

// Services offered by barbers
export const services = pgTable("services", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  barberId: integer("barber_id").notNull().references(() => barbers.id),
  name: text("name").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // EUR
  isActive: boolean("is_active").default(true),
});

// Appointments
export const appointments = pgTable("appointments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  customerId: text("customer_id").notNull().references(() => users.id),
  barberId: integer("barber_id").notNull().references(() => barbers.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "cancelled", "completed"] }).default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  appointmentId: integer("appointment_id").notNull().references(() => appointments.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform Subscriptions (e.g., Gold Pass)
export const subscriptions = pgTable("subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(), // "Premium Barber Access"
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  maxBarbers: integer("max_barbers"), // NULL = unlimited
});

// User Subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => users.id),
  subscriptionId: integer("subscription_id").notNull().references(() => subscriptions.id),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  status: text("status", { enum: ["active", "cancelled", "expired"] }).default("active"),
});

// === RELATIONS ===
export const barbersRelations = relations(barbers, ({ one, many }) => ({
  user: one(users, {
    fields: [barbers.userId],
    references: [users.id],
  }),
  services: many(services),
  appointments: many(appointments),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  barber: one(barbers, {
    fields: [services.barberId],
    references: [barbers.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  barber: one(barbers, {
    fields: [appointments.barberId],
    references: [barbers.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
  customer: one(users, {
    fields: [appointments.customerId],
    references: [users.id],
  }),
  review: one(reviews, {
    fields: [appointments.id],
    references: [reviews.appointmentId],
  }),
}));

// === SCHEMAS ===
export const insertBarberSchema = z.object({
  userId: z.string().optional(),
  shopName: z.string().min(1, "Shop name is required"),
  bio: z.string().nullable().optional(),
  location: z.string().min(1, "Location is required"),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional().default("Germany"),
  workingHours: z.record(z.object({
    start: z.string(),
    end: z.string(),
    isOpen: z.boolean()
  })).nullable().optional(),
  isVerified: z.boolean().optional(),
});

export const insertServiceSchema = z.object({
  barberId: z.coerce.number(),
  name: z.string().min(1, "Service name is required"),
  description: z.string().nullable().optional(),
  durationMinutes: z.coerce.number().min(1),
  price: z.string(),
  isActive: z.boolean().optional().default(true),
});

export const insertAppointmentSchema = z.object({
  customerId: z.string().optional(),
  barberId: z.coerce.number(),
  serviceId: z.coerce.number(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional().default("pending"),
  notes: z.string().nullable().optional(),
});

export const insertReviewSchema = z.object({
  appointmentId: z.coerce.number(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().nullable().optional(),
});

// === TYPES ===
export type Barber = typeof barbers.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type UserSubscription = typeof userSubscriptions.$inferSelect;

// Explicit insert types for clarity
export type InsertBarber = {
  userId?: string;
  shopName: string;
  bio?: string | null;
  location: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  workingHours?: { [key: string]: { start: string; end: string; isOpen: boolean } } | null;
  isVerified?: boolean;
};

export type InsertService = {
  barberId: number;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: string;
  isActive?: boolean;
};

export type InsertAppointment = {
  customerId?: string;
  barberId: number;
  serviceId: number;
  startTime: Date;
  endTime: Date;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string | null;
};
