import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertService } from "@shared/routes";
import { z } from "zod";

export function useServices(barberId: number) {
  return useQuery({
    queryKey: [api.services.list.path, barberId],
    queryFn: async () => {
      const url = buildUrl(api.services.list.path, { barberId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch services");
      return api.services.list.responses[200].parse(await res.json());
    },
    enabled: !!barberId && !isNaN(barberId),
  });
}

export function useCreateService(barberId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertService) => {
      // Coerce numerics as forms often return strings
      const payload = {
        ...data,
        price: Number(data.price),
        durationMinutes: Number(data.durationMinutes)
      };

      const url = buildUrl(api.services.create.path, { barberId });
      const res = await fetch(url, {
        method: api.services.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.services.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create service");
      }
      return api.services.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.services.list.path, barberId] });
    },
  });
}
