type BillingCycle = "WEEKLY" | "MONTHLY" | "YEARLY";

type CategoryDemo = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

type SubscriptionDemo = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  categoryId: string;
  reminderDaysBefore: number;
  active: boolean;
  nextBillingDate: number;
};

const categories: CategoryDemo[] = [
  { id: "cat-ent", name: "Entertainment", color: "#52ff9f", icon: "TV" },
  { id: "cat-work", name: "Work Tools", color: "#91ff66", icon: "Work" },
  { id: "cat-cloud", name: "Cloud Services", color: "#65ffcf", icon: "Cloud" },
];

const subscriptions: SubscriptionDemo[] = [
  {
    id: "sub-1",
    name: "Netflix",
    description: "Movies and series plan",
    price: 15.99,
    currency: "USD",
    billingCycle: "MONTHLY",
    categoryId: "cat-ent",
    reminderDaysBefore: 3,
    active: true,
    nextBillingDate: Date.now() + 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: "sub-2",
    name: "YouTube Premium",
    description: "Ad-free and music access",
    price: 11.99,
    currency: "USD",
    billingCycle: "MONTHLY",
    categoryId: "cat-ent",
    reminderDaysBefore: 3,
    active: true,
    nextBillingDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: "sub-3",
    name: "Notion Plus",
    description: "Team docs and project workspace",
    price: 12,
    currency: "USD",
    billingCycle: "MONTHLY",
    categoryId: "cat-work",
    reminderDaysBefore: 3,
    active: true,
    nextBillingDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: "sub-4",
    name: "Figma Professional",
    description: "Collaborative design platform",
    price: 15,
    currency: "USD",
    billingCycle: "MONTHLY",
    categoryId: "cat-work",
    reminderDaysBefore: 3,
    active: false,
    nextBillingDate: Date.now() + 11 * 24 * 60 * 60 * 1000,
  },
  {
    id: "sub-5",
    name: "AWS Lightsail",
    description: "Virtual servers and managed storage",
    price: 32,
    currency: "USD",
    billingCycle: "MONTHLY",
    categoryId: "cat-cloud",
    reminderDaysBefore: 3,
    active: true,
    nextBillingDate: Date.now() + 5 * 24 * 60 * 60 * 1000,
  },
];

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(timestamp);
}

function Subscription() {
  return (
    <section className="subscription-page">
      <header className="top-strip">
        <div>
          <p className="kicker">Demo View</p>
          <h2 className="main-heading">Subscriptions by Category</h2>
        </div>
      </header>

      <div className="category-stack">
        {categories.map((category) => {
          const relatedSubscriptions = subscriptions.filter(
            (sub) => sub.categoryId === category.id,
          );

          return (
            <article key={category.id} className="category-band panel">
              <header className="category-band-header">
                <div className="category-meta">
                  <span
                    className="category-dot"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  />
                  <div>
                    <h3>{category.name}</h3>
                    <small>
                      {category.icon} • {relatedSubscriptions.length}{" "}
                      subscriptions
                    </small>
                  </div>
                </div>
              </header>

              <div className="subscription-card-row">
                {relatedSubscriptions.map((sub) => (
                  <section key={sub.id} className="subscription-card">
                    <div className="subscription-card-head">
                      <h4>{sub.name}</h4>
                      <span
                        className={sub.active ? "chip active" : "chip paused"}
                      >
                        {sub.active ? "Active" : "Paused"}
                      </span>
                    </div>

                    <p className="subscription-description">
                      {sub.description}
                    </p>

                    <dl>
                      <div>
                        <dt>Price</dt>
                        <dd>{formatMoney(sub.price, sub.currency)}</dd>
                      </div>
                      <div>
                        <dt>Billing Cycle</dt>
                        <dd>{sub.billingCycle}</dd>
                      </div>
                      <div>
                        <dt>Reminder</dt>
                        <dd>{sub.reminderDaysBefore} days before</dd>
                      </div>
                      <div>
                        <dt>Next Billing</dt>
                        <dd>{formatDate(sub.nextBillingDate)}</dd>
                      </div>
                    </dl>
                  </section>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Subscription;
