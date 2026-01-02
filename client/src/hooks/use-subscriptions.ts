import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useSubscriptions() {
  return useQuery({
    queryKey: [api.subscriptions.list.path],
    queryFn: async () => {
      const res = await fetch(api.subscriptions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      return api.subscriptions.list.responses[200].parse(await res.json());
    },
  });
}
