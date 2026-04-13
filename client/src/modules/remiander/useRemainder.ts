import { useEffect, useState } from "react";
import { getAllRemainders, getSubscriptionSummaries } from "./remainder.api";
import type { UpcomingRemainderItem } from "./remainder.types";

const MAX_UPCOMING_ITEMS = 3;

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDueIn(targetTimestamp: number) {
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.ceil((targetTimestamp - now) / msPerDay);

  if (days <= 0) {
    return "today";
  }

  if (days === 1) {
    return "in 1 day";
  }

  return `in ${days} days`;
}

export default function useRemainder() {
  const [upcomingRemainders, setUpcomingRemainders] = useState<
    UpcomingRemainderItem[]
  >([]);

  useEffect(() => {
    let isMounted = true;

    const loadRemainders = async () => {
      try {
        const [remainders, subscriptions] = await Promise.all([
          getAllRemainders(),
          getSubscriptionSummaries(),
        ]);

        const subscriptionMap = new Map(
          subscriptions.map((subscription) => [subscription.id, subscription]),
        );

        const nextItems: UpcomingRemainderItem[] = remainders
          .filter((item) => item.status === "PENDING")
          .sort((a, b) => a.nextBillingDate - b.nextBillingDate)
          .slice(0, MAX_UPCOMING_ITEMS)
          .map((item) => {
            const subscription = subscriptionMap.get(item.subscriptionId);

            return {
              title: item.subscriptionName,
              dueIn: formatDueIn(item.nextBillingDate),
              amount: subscription
                ? formatMoney(subscription.price, subscription.currency)
                : "N/A",
            };
          });

        if (isMounted) {
          setUpcomingRemainders(nextItems);
        }
      } catch {
        if (isMounted) {
          setUpcomingRemainders([]);
        }
      }
    };

    void loadRemainders();

    return () => {
      isMounted = false;
    };
  }, []);

  return { upcomingRemainders };
}
