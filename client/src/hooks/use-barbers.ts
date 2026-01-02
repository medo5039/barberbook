import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertBarber } from "@shared/routes";

export function useBarbers(filters?: { city?: string; search?: string }) {
  return useQuery({
    queryKey: [api.barbers.list.path, filters],
    queryFn: async () => {
      const url = filters 
        ? `${api.barbers.list.path}?${new URLSearchParams(filters as any).toString()}`
        : api.barbers.list.path;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch barbers");
      return api.barbers.list.responses[200].parse(await res.json());
    },
  });
}

export function useBarber(id: number) {
  return useQuery({
    queryKey: [api.barbers.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.barbers.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch barber");
      return api.barbers.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useBarberStats(id: number) {
  return useQuery({
    queryKey: [api.barbers.getStats.path, id],
    queryFn: async () => {
      const url = buildUrl(api.barbers.getStats.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.barbers.getStats.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateBarber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertBarber) => {
      const res = await fetch(api.barbers.create.path, {
        method: api.barbers.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.barbers.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create barber profile");
      }
      return api.barbers.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.barbers.list.path] });
    },
  });
}
