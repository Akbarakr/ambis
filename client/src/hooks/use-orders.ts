import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { CreateOrderRequest, Order } from "@shared/schema";

export function useOrders() {
  return useQuery({
    queryKey: [api.orders.list.path],
    queryFn: async () => {
      const res = await fetch(api.orders.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      // Note: The response is typed as any[] in manifest currently due to complex relation types
      // In a real scenario, we'd define the Zod schema for the relation properly.
      return await res.json();
    },
  });
}

export function useOrder(id: number | null) {
  return useQuery({
    queryKey: [api.orders.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.orders.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch order");
      return await res.json();
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOrderRequest) => {
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create order");
      return api.orders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.orders.list.path] }),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, paymentStatus }: { id: number, status: string, paymentStatus?: string }) => {
      const url = buildUrl(api.orders.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.orders.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update order status");
      return api.orders.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.orders.get.path, data.id] });
    },
  });
}
