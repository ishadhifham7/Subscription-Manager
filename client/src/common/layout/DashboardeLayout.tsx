import { useMemo, useState } from "react";
import Calender from "./Calender";
import Sidebar from "./Sidebar";
import Subscription from "./Subscription";

type Stat = {
  label: string;
  value: string;
  change: string;
};

type DemoReminder = {
  title: string;
  dueIn: string;
  amount: string;
};

type DemoSubscription = {
  name: string;
  cycle: "Weekly" | "Monthly" | "Yearly";
  nextCharge: string;
  status: "Active" | "Paused";
  amount: string;
};

const stats: Stat[] = [
  { label: "Active Subscriptions", value: "14", change: "+2 this month" },
  { label: "Monthly Spend", value: "$186.47", change: "-8% from last month" },
  { label: "Upcoming Charges", value: "6", change: "3 in next 3 days" },
];

const reminders: DemoReminder[] = [
  { title: "Notion Pro", dueIn: "in 2 days", amount: "$12.00" },
  { title: "YouTube Premium", dueIn: "in 3 days", amount: "$11.99" },
  { title: "Figma Professional", dueIn: "in 3 days", amount: "$15.00" },
];

const subscriptions: DemoSubscription[] = [
  {
    name: "Netflix",
    cycle: "Monthly",
    nextCharge: "Apr 15, 2026",
    status: "Active",
    amount: "$15.99",
  },
  {
    name: "Spotify",
    cycle: "Monthly",
    nextCharge: "Apr 16, 2026",
    status: "Active",
    amount: "$10.99",
  },
  {
    name: "AWS Lightsail",
    cycle: "Monthly",
    nextCharge: "Apr 19, 2026",
    status: "Paused",
    amount: "$32.00",
  },
  {
    name: "ChatGPT Plus",
    cycle: "Monthly",
    nextCharge: "Apr 20, 2026",
    status: "Active",
    amount: "$20.00",
  },
];

function DashboardeLayout() {
  const [activeView, setActiveView] = useState("Dashboard");

  const isSubscriptionView = useMemo(
    () => activeView === "Subscriptions",
    [activeView],
  );

  return (
    <div className="dashboard-shell">
      <Sidebar activeItem={activeView} onSelectItem={setActiveView} />

      <main className="dashboard-main">
        {isSubscriptionView ? (
          <Subscription />
        ) : (
          <>
            <section className="top-strip">
              <div>
                <p className="kicker">Today Overview</p>
                <h2 className="main-heading">Subscription Dashboard</h2>
              </div>
              <button type="button" className="action-button">
                + Add Subscription
              </button>
            </section>

            <section className="stats-grid">
              {stats.map((card) => (
                <article key={card.label} className="stat-card">
                  <p>{card.label}</p>
                  <h3>{card.value}</h3>
                  <span>{card.change}</span>
                </article>
              ))}
            </section>

            <section className="content-grid">
              <article className="panel reminders-panel">
                <header>
                  <h3>Upcoming Remainders</h3>
                  <small>Demo data</small>
                </header>

                <ul>
                  {reminders.map((item) => (
                    <li key={item.title}>
                      <div>
                        <p>{item.title}</p>
                        <span>{item.dueIn}</span>
                      </div>
                      <strong>{item.amount}</strong>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="panel table-panel">
                <header>
                  <h3>Subscriptions</h3>
                  <small>Demo data</small>
                </header>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Cycle</th>
                        <th>Next Charge</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((item) => (
                        <tr key={item.name}>
                          <td>{item.name}</td>
                          <td>{item.cycle}</td>
                          <td>{item.nextCharge}</td>
                          <td>
                            <span
                              className={
                                item.status === "Active"
                                  ? "chip active"
                                  : "chip paused"
                              }
                            >
                              {item.status}
                            </span>
                          </td>
                          <td>{item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default DashboardeLayout;
