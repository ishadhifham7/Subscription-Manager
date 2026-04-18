import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Subscription from "./Subscription";
import CalenderPage from "./CalenderPage";
import useRemainder from "../../modules/remiander/useRemainder";
import useDashboardSubscriptions from "../../modules/subscription/useDashboardSubscriptions";
import { AuthContext } from "../../auth/authContext";
import { signOut } from "../../auth/authService";

function useDashboardStats(
  subscriptions: ReturnType<typeof useDashboardSubscriptions>["subscriptions"],
  totalRemainders: number,
) {
  const activeCount = subscriptions.filter((s) => s.status === "Active").length;
  const totalLKR = subscriptions.reduce((sum, s) => sum + s.priceValue, 0);
  // Format as LKR
  const formattedLKR = `LKR ${totalLKR.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  return [
    {
      label: "Active Subscriptions",
      value: String(activeCount),
      change: "+2 this month",
    },
    {
      label: "Monthly Spend",
      value: formattedLKR,
      change: "-8% from last month",
    },
    { label: "Total Remainders", value: String(totalRemainders), change: "" },
  ];
}

function DashboardeLayout() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("Dashboard");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { upcomingRemainders, totalPendingRemainders } = useRemainder();
  const { subscriptions } = useDashboardSubscriptions();

  const totalRemainders = totalPendingRemainders;

  const isSubscriptionView = useMemo(
    () => activeView === "Subscriptions",
    [activeView],
  );
  const isCalenderView = useMemo(() => activeView === "Calendar", [activeView]);

  const stats = useDashboardStats(subscriptions, totalRemainders);

  const handleLogout = async () => {
    if (!context || isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    const requireAuth =
      (import.meta.env.VITE_REQUIRE_AUTH ?? "false").toLowerCase() === "true";

    try {
      if (requireAuth) {
        await signOut();
      }
    } finally {
      context.setAuth({
        loading: false,
        isProcessingRedirect: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });

      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="dashboard-shell">
      <Sidebar
        activeItem={activeView}
        onSelectItem={setActiveView}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <main className="dashboard-main">
        {isSubscriptionView ? (
          <Subscription />
        ) : isCalenderView ? (
          <CalenderPage subscriptions={subscriptions} />
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
                  <small>Live data</small>
                </header>

                <ul>
                  {upcomingRemainders.map((item) => (
                    <li key={`${item.title}-${item.dueIn}-${item.amount}`}>
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
