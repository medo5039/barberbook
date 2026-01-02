import { db } from "./db";
import {
  users, barbers, services, appointments, reviews, subscriptions,
  type Barber, type Service, type Appointment, type Subscription,
  type InsertBarber, type InsertService, type InsertAppointment
} from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Barbers
  getBarber(id: number): Promise<Barber | undefined>;
  getBarberByUserId(userId: string): Promise<Barber | undefined>;
  getBarbers(filters?: { city?: string; search?: string }): Promise<Barber[]>;
  createBarber(barber: InsertBarber): Promise<Barber>;
  updateBarber(id: number, barber: Partial<InsertBarber>): Promise<Barber>;
  
  // Services
  getServices(barberId: number): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  // Appointments
  getAppointments(filters: { userId: string; role: 'customer' | 'barber' }): Promise<(Appointment & { service: Service, barber: Barber })[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment>;
  
  // Subscriptions
  getSubscriptions(): Promise<Subscription[]>;
  
  // Stats
  getBarberStats(barberId: number): Promise<{ totalAppointments: number; totalRevenue: number }>;
}

export class DatabaseStorage implements IStorage {
  async getBarber(id: number): Promise<Barber | undefined> {
    const [barber] = await db.select().from(barbers).where(eq(barbers.id, id));
    return barber;
  }

  async getBarberByUserId(userId: string): Promise<Barber | undefined> {
    const [barber] = await db.select().from(barbers).where(eq(barbers.userId, userId));
    return barber;
  }

  async getBarbers(filters?: { city?: string; search?: string }): Promise<Barber[]> {
    let query = db.select().from(barbers);
    
    if (filters?.city) {
      query = query.where(eq(barbers.city, filters.city)) as any;
    }
    // Simple search implementation
    if (filters?.search) {
      // In a real app, use ILIKE or full text search
      // query = query.where(ilike(barbers.shopName, `%${filters.search}%`));
    }
    
    return await query;
  }

  async createBarber(insertBarber: InsertBarber): Promise<Barber> {
    const [barber] = await db.insert(barbers).values(insertBarber as any).returning();
    return barber;
  }

  async updateBarber(id: number, updates: Partial<InsertBarber>): Promise<Barber> {
    const [updated] = await db.update(barbers).set(updates).where(eq(barbers.id, id)).returning();
    return updated;
  }

  async getServices(barberId: number): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.barberId, barberId));
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async getAppointments(filters: { userId: string; role: 'customer' | 'barber' }): Promise<(Appointment & { service: Service, barber: Barber })[]> {
    const query = db.select({
        appointment: appointments,
        service: services,
        barber: barbers
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .innerJoin(barbers, eq(appointments.barberId, barbers.id))
      .orderBy(desc(appointments.startTime));

    if (filters.role === 'customer') {
      query.where(eq(appointments.customerId, filters.userId));
    } else {
      // First find the barber ID for this user
      const barber = await this.getBarberByUserId(filters.userId);
      if (!barber) return [];
      query.where(eq(appointments.barberId, barber.id));
    }

    const results = await query;
    return results.map(r => ({ ...r.appointment, service: r.service, barber: r.barber }));
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(insertAppointment as any).returning();
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    const [updated] = await db.update(appointments)
      .set({ status: status as any })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  async getSubscriptions(): Promise<Subscription[]> {
    return await db.select().from(subscriptions);
  }

  async getBarberStats(barberId: number): Promise<{ totalAppointments: number; totalRevenue: number }> {
    const [stats] = await db.select({
      count: sql<number>`count(*)`,
      revenue: sql<number>`sum(${services.price})`
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(and(
      eq(appointments.barberId, barberId),
      eq(appointments.status, 'completed')
    ));

    return {
      totalAppointments: Number(stats?.count || 0),
      totalRevenue: Number(stats?.revenue || 0)
    };
  }
}

export const storage = new DatabaseStorage();
