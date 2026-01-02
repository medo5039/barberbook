import { db } from "./db";
import { users, barbers, services, appointments, subscriptions } from "@shared/schema";
import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  // Create Subscriptions
  await db.insert(subscriptions).values([
    { name: "Basic", price: "0.00", maxBarbers: 1, description: "Free account" },
    { name: "Gold", price: "29.99", maxBarbers: 5, description: "Access to top rated barbers" },
    { name: "Platinum", price: "49.99", maxBarbers: null, description: "Unlimited access" },
  ]);

  // Create Barbers
  // Need to create users first via auth logic or manually inserting if we want to bypass auth for seed
  // For seeding, we'll just insert into 'users' directly as it's just a table.
  
  const [barberUser] = await db.insert(users).values({
    email: "barber@example.com",
    firstName: "Hans",
    lastName: "Müller",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hans",
  }).returning();

  const [customerUser] = await db.insert(users).values({
    email: "customer@example.com",
    firstName: "Fritz",
    lastName: "Schmidt",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fritz",
  }).returning();

  const [barber] = await db.insert(barbers).values({
    userId: barberUser.id,
    shopName: "Hans's Barbershop",
    bio: "Best cuts in Berlin since 2010.",
    location: "Berlin, Germany",
    city: "Berlin",
    country: "Germany",
    workingHours: {
      "mon": { start: "09:00", end: "18:00", isOpen: true },
      "tue": { start: "09:00", end: "18:00", isOpen: true },
      "wed": { start: "09:00", end: "18:00", isOpen: true },
      "thu": { start: "09:00", end: "18:00", isOpen: true },
      "fri": { start: "09:00", end: "18:00", isOpen: true },
      "sat": { start: "10:00", end: "14:00", isOpen: true },
      "sun": { start: "00:00", end: "00:00", isOpen: false },
    },
    isVerified: true
  }).returning();

  // Create Services
  const [cut] = await db.insert(services).values({
    barberId: barber.id,
    name: "Classic Cut",
    description: "Traditional haircut with scissors and clipper.",
    durationMinutes: 30,
    price: "25.00"
  }).returning();

  await db.insert(services).values({
    barberId: barber.id,
    name: "Beard Trim",
    description: "Shape and trim your beard.",
    durationMinutes: 15,
    price: "15.00"
  });

  // Create Appointment
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);
  const endTime = new Date(tomorrow);
  endTime.setMinutes(endTime.getMinutes() + 30);

  await db.insert(appointments).values({
    customerId: customerUser.id,
    barberId: barber.id,
    serviceId: cut.id,
    startTime: tomorrow,
    endTime: endTime,
    status: "confirmed",
    notes: "First time visit"
  });

  console.log("Seeding complete!");
}

seed().catch(console.error);
