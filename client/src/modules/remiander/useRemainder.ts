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
  const [totalPendingRemainders, setTotalPendingRemainders] = useState(0);

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

        const pendingRemainders = remainders.filter(
          (item) => item.status === "PENDING",
        );

        const nextItems: UpcomingRemainderItem[] = pendingRemainders
          .sort((a, b) => a.reminderDate - b.reminderDate)
          .slice(0, MAX_UPCOMING_ITEMS)
          .map((item) => {
            const subscription = subscriptionMap.get(item.subscriptionId);
            const dueTimestamp = item.reminderDate || item.nextBillingDate;

            return {
              title: item.subscriptionName,
              dueIn: formatDueIn(dueTimestamp),
              amount: subscription
                ? formatMoney(subscription.price, subscription.currency)
                : "N/A",
            };
          });

        if (isMounted) {
          setUpcomingRemainders(nextItems);
          setTotalPendingRemainders(pendingRemainders.length);
        }
      } catch {
        if (isMounted) {
          setUpcomingRemainders([]);
          setTotalPendingRemainders(0);
        }
      }
    };

    void loadRemainders();

    return () => {
      isMounted = false;
    };
  }, []);

  return { upcomingRemainders, totalPendingRemainders };
}
