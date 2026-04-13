export type RemainderStatus = "PENDING" | "DISMISSED";

export type RemainderResponse = {
  id: string;
  subscriptionId: string;
  subscriptionName: string;
  nextBillingDate: number;
  reminderDate: number;
  billingCycle: "WEEKLY" | "MONTHLY" | "YEARLY";
  daysBefore: number;
  cycleRef: string;
  status: RemainderStatus;
  createdAt: number;
};

export type SubscriptionSummary = {
  id: string;
  price: number;
  currency: string;
};

export type UpcomingRemainderItem = {
  title: string;
  dueIn: string;
  amount: string;
};
