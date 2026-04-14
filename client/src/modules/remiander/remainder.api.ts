import type { RemainderResponse, SubscriptionSummary } from "./remainder.types";
import { apiClient } from "../../api/client";

export async function getAllRemainders(): Promise<RemainderResponse[]> {
  return apiClient<RemainderResponse[]>("/api/remainders", {
    method: "GET",
  });
}

type SubscriptionResponse = {
  id: string;
  price: number;
  currency: string;
};

export async function getSubscriptionSummaries(): Promise<
  SubscriptionSummary[]
> {
  const data = await apiClient<SubscriptionResponse[]>("/api/subscriptions", {
    method: "GET",
  });

  return data.map((item) => ({
    id: item.id,
    price: item.price,
    currency: item.currency,
  }));
}
