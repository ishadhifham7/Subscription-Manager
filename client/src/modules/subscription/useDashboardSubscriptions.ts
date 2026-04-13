import { useEffect, useState } from "react";

type DashboardSubscription = {
  name: string;
  cycle: "Weekly" | "Monthly" | "Yearly";
  nextCharge: string;
  status: "Active" | "Paused";
  amount: string;
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
        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
        const response = await fetch(`${API_BASE_URL}/api/subscriptions`);
        if (!response.ok) throw new Error("Failed to load subscriptions");
        const data = await response.json();
        const mapped = (data as any[]).map((item) => {
          let cycle: "Weekly" | "Monthly" | "Yearly" = "Monthly";
          if (item.billingCycle === "WEEKLY") cycle = "Weekly";
          else if (item.billingCycle === "MONTHLY") cycle = "Monthly";
          else if (item.billingCycle === "YEARLY") cycle = "Yearly";
          // fallback to 'Monthly' if unknown
          const status: "Active" | "Paused" =
            item.active === false ? "Paused" : "Active";
          return {
            name: item.name,
            cycle,
            nextCharge: formatDate(item.nextBillingDate),
            status,
            amount: formatMoney(item.price, item.currency),
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
