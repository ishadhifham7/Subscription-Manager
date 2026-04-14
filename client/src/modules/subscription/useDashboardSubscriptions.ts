import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";

export type DashboardSubscription = {
  id: string;
  name: string;
  cycle: "Weekly" | "Monthly" | "Yearly";
  nextCharge: string;
  nextChargeTimestamp: number | null;
  status: "Active" | "Paused";
  amount: string;
  priceValue: number;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(timestamp: number) {
  if (!timestamp) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(timestamp);
}

export default function useDashboardSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<DashboardSubscription[]>(
    [],
  );

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await apiClient<any[]>("/api/subscriptions", {
          method: "GET",
        });
        const mapped = (data as any[]).map((item) => {
          let cycle: "Weekly" | "Monthly" | "Yearly" = "Monthly";
          if (item.billingCycle === "WEEKLY") cycle = "Weekly";
          else if (item.billingCycle === "MONTHLY") cycle = "Monthly";
          else if (item.billingCycle === "YEARLY") cycle = "Yearly";
          // fallback to 'Monthly' if unknown
          const status: "Active" | "Paused" =
            item.active === false ? "Paused" : "Active";
          const nextChargeTimestamp =
            typeof item.nextBillingDate === "number"
              ? item.nextBillingDate
              : null;
          const priceValue =
            typeof item.price === "number" && Number.isFinite(item.price)
              ? item.price
              : 0;
          const currency =
            typeof item.currency === "string" && item.currency.trim()
              ? item.currency
              : "USD";
          return {
            id: String(item.id ?? item.name ?? ""),
            name: item.name,
            cycle,
            nextCharge: formatDate(nextChargeTimestamp ?? 0),
            nextChargeTimestamp,
            status,
            amount: formatMoney(priceValue, currency),
            priceValue,
          };
        });
        if (isMounted) setSubscriptions(mapped);
      } catch {
        if (isMounted) setSubscriptions([]);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { subscriptions };
}
