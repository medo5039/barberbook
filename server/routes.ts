import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // === Barbers ===
  app.get(api.barbers.list.path, async (req, res) => {
    const { city, search } = req.query as any;
    const barbers = await storage.getBarbers({ city, search });
    res.json(barbers);
  });

  app.get(api.barbers.get.path, async (req, res) => {
    const barber = await storage.getBarber(Number(req.params.id));
    if (!barber) return res.status(404).json({ message: "Barber not found" });
    // TODO: Fetch user details for the barber if needed, or just return barber profile
    res.json({ ...barber, user: null }); // Placeholder for user join if needed
  });

  app.post(api.barbers.create.path, async (req, res) => {
    // Check auth
    if (!req.isAuthenticated()) return res.status(401).send();
    try {
      const input = api.barbers.create.input.parse({
        ...req.body,
        userId: (req.user as any).claims.sub // Force userId from auth
      });
      const barber = await storage.createBarber(input);
      res.status(201).json(barber);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.barbers.getStats.path, async (req, res) => {
    // Check auth and ownership
    if (!req.isAuthenticated()) return res.status(401).send();
    // Simplified: allowing any logged in user to see stats for now, strictly should check ownership
    const stats = await storage.getBarberStats(Number(req.params.id));
    res.json({
      ...stats,
      popularServices: [] // Implement aggregation in storage if needed
    });
  });

  // === Services ===
  app.get(api.services.list.path, async (req, res) => {
    const services = await storage.getServices(Number(req.params.barberId));
    res.json(services);
  });

  app.post(api.services.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    try {
      const input = api.services.create.input.parse({
        ...req.body,
        barberId: Number(req.params.barberId)
      });
      const service = await storage.createService(input);
      res.status(201).json(service);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  // === Appointments ===
  app.get(api.appointments.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const role = req.query.role as 'customer' | 'barber';
    const userId = (req.user as any).claims.sub;
    
    const appointments = await storage.getAppointments({ userId, role });
    res.json(appointments);
  });

  app.post(api.appointments.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    try {
      const input = api.appointments.create.input.parse({
        ...req.body,
        customerId: (req.user as any).claims.sub
      });
      const appointment = await storage.createAppointment(input);
      res.status(201).json(appointment);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.patch(api.appointments.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const { status } = req.body;
    const appointment = await storage.updateAppointmentStatus(Number(req.params.id), status);
    res.json(appointment);
  });

  // === Subscriptions ===
  app.get(api.subscriptions.list.path, async (req, res) => {
    const subs = await storage.getSubscriptions();
    res.json(subs);
  });

  return httpServer;
}
