import { z } from 'zod';
import { insertBarberSchema, insertServiceSchema, insertAppointmentSchema, insertReviewSchema, barbers, services, appointments, reviews, subscriptions, type InsertBarber, type InsertService, type InsertAppointment } from './schema';

// Re-export types for frontend
export type { InsertBarber, InsertService, InsertAppointment };

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  barbers: {
    list: {
      method: 'GET' as const,
      path: '/api/barbers',
      input: z.object({
        city: z.string().optional(),
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof barbers.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/barbers/:id',
      responses: {
        200: z.custom<typeof barbers.$inferSelect & { user: any }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/barbers',
      input: insertBarberSchema,
      responses: {
        201: z.custom<typeof barbers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/barbers/:id',
      input: insertBarberSchema.partial(),
      responses: {
        200: z.custom<typeof barbers.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getStats: {
      method: 'GET' as const,
      path: '/api/barbers/:id/stats',
      responses: {
        200: z.object({
          totalAppointments: z.number(),
          totalRevenue: z.number(),
          popularServices: z.array(z.object({ name: z.string(), count: z.number() })),
        }),
      }
    }
  },
  services: {
    list: {
      method: 'GET' as const,
      path: '/api/barbers/:barberId/services',
      responses: {
        200: z.array(z.custom<typeof services.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/barbers/:barberId/services',
      input: insertServiceSchema,
      responses: {
        201: z.custom<typeof services.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  appointments: {
    list: {
      method: 'GET' as const,
      path: '/api/appointments',
      input: z.object({
        role: z.enum(['customer', 'barber']),
        from: z.string().optional(), // Date ISO
        to: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof appointments.$inferSelect & { service: typeof services.$inferSelect, barber: typeof barbers.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/appointments',
      input: insertAppointmentSchema,
      responses: {
        201: z.custom<typeof appointments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/appointments/:id/status',
      input: z.object({ status: z.enum(["confirmed", "cancelled", "completed"]) }),
      responses: {
        200: z.custom<typeof appointments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  subscriptions: {
    list: {
      method: 'GET' as const,
      path: '/api/subscriptions',
      responses: {
        200: z.array(z.custom<typeof subscriptions.$inferSelect>()),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
