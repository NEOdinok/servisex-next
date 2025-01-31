import { GetOrdersResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useOrderStatus(orderId: string | null) {
  return useQuery({
    queryKey: ["orderStatus", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("No order ID provided");

      const response = await fetch(`/api/getOrdersByIds?ids=${orderId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch order status");
      }

      const data = (await response.json()) as GetOrdersResponse;
      return data.orders?.[0]?.status || "error";
    },
    enabled: Boolean(orderId),
    refetchInterval: (query) => {
      const status = query.state.data;
      console.log("useOrderStatus:", status);

      if (!status || status === "error") return false;

      if (["paid", "canceled", "no-product"].includes(status)) {
        return false;
      }

      return 4000;
    },
    staleTime: 0,
    retry: 2,
  });
}
