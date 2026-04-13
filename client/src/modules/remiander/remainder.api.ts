import type { RemainderResponse, SubscriptionSummary } from "./remainder.types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function getAllRemainders(): Promise<RemainderResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/remainders`);

  if (!response.ok) {
    throw new Error("Failed to load reminders");
  }

  return response.json() as Promise<RemainderResponse[]>;
}

type SubscriptionResponse = {
  id: string;
  price: number;
  currency: string;
};

export async function getSubscriptionSummaries(): Promise<
  SubscriptionSummary[]
> {
  const response = await fetch(`${API_BASE_URL}/api/subscriptions`);

  if (!response.ok) {
    throw new Error("Failed to load subscriptions");
  }

  const data = (await response.json()) as SubscriptionResponse[];

  return data.map((item) => ({
    id: item.id,
    price: item.price,
    currency: item.currency,
  }));
}
