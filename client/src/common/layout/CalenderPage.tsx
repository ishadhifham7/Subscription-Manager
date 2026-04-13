import { useMemo, useState } from "react";
import { generateCalendar } from "../../utils/calenderUtils";
import type { DashboardSubscription } from "../../modules/subscription/useDashboardSubscriptions";

type CalenderPageProps = {
  subscriptions: DashboardSubscription[];
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameMonth(date: Date, monthRef: Date) {
  return (
    date.getFullYear() === monthRef.getFullYear() &&
    date.getMonth() === monthRef.getMonth()
  );
}

function CalenderPage({ subscriptions }: CalenderPageProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [currentMonth],
  );

  const calendarWeeks = useMemo(
    () => generateCalendar(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth],
  );

  const billingByDate = useMemo(() => {
    const mapped = new Map<string, DashboardSubscription[]>();

    subscriptions.forEach((subscription) => {
      if (!subscription.nextChargeTimestamp) {
        return;
      }

      const billingDate = new Date(subscription.nextChargeTimestamp);
      if (!isSameMonth(billingDate, currentMonth)) {
        return;
      }

      const key = toDateKey(billingDate);
      const existing = mapped.get(key);

      if (existing) {
        existing.push(subscription);
      } else {
        mapped.set(key, [subscription]);
      }
    });

    return mapped;
  }, [subscriptions, currentMonth]);

  const selectedDateKey = useMemo(() => {
    if (selectedDay === null) {
      return null;
    }

    return toDateKey(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        selectedDay,
      ),
    );
  }, [currentMonth, selectedDay]);

  const selectedDayItems = useMemo(() => {
    if (!selectedDateKey) {
      return [];
    }

    const items = billingByDate.get(selectedDateKey) ?? [];
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [billingByDate, selectedDateKey]);

  const totalBillingThisMonth = useMemo(() => {
    let total = 0;

    billingByDate.forEach((items) => {
      items.forEach((item) => {
        total += item.priceValue;
      });
    });

    return total;
  }, [billingByDate]);

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
    setSelectedDay(null);
  };

  return (
    <section className="calendar-page">
      <header className="calendar-header">
        <div>
          <p className="kicker">Organize</p>
          <h2 className="main-heading">Billing Calendar</h2>
        </div>
        <div className="calendar-header-metrics">
          <span>
            Bills This Month:{" "}
            <strong>{Array.from(billingByDate.values()).flat().length}</strong>
          </span>
          <span>
            Total:{" "}
            <strong>
              LKR{" "}
              {totalBillingThisMonth.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </span>
        </div>
      </header>

      <div className="calendar-layout">
        <article className="panel calendar-panel">
          <div className="calendar-toolbar">
            <button
              type="button"
              className="calendar-nav-button"
              onClick={goToPreviousMonth}
            >
              Previous
            </button>
            <h3>{monthLabel}</h3>
            <button
              type="button"
              className="calendar-nav-button"
              onClick={goToNextMonth}
            >
              Next
            </button>
          </div>

          <div
            className="calendar-grid"
            role="grid"
            aria-label="Billing calendar"
          >
            {WEEK_DAYS.map((day) => (
              <div key={day} className="calendar-weekday" role="columnheader">
                {day}
              </div>
            ))}

            {calendarWeeks.flat().map((day, index) => {
              if (!day) {
                return (
                  <div key={`empty-${index}`} className="calendar-day empty" />
                );
              }

              const key = toDateKey(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day,
                ),
              );
              const items = billingByDate.get(key) ?? [];
              const sortedItems = [...items].sort((a, b) =>
                a.name.localeCompare(b.name),
              );
              const visibleMarkers = sortedItems.slice(0, 2);
              const hasBills = items.length > 0;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={key}
                  type="button"
                  className={`calendar-day${hasBills ? " has-bill" : ""}${isSelected ? " selected" : ""}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className="day-number">{day}</span>
                  {hasBills ? (
                    <>
                      <div className="tile-markers">
                        {visibleMarkers.map((item) => (
                          <span
                            key={item.id}
                            className="tile-subscription-marker"
                          >
                            {item.name}
                          </span>
                        ))}
                      </div>
                      {items.length > visibleMarkers.length ? (
                        <span className="bill-count">
                          +{items.length - visibleMarkers.length} more
                        </span>
                      ) : null}
                    </>
                  ) : null}
                </button>
              );
            })}
          </div>
        </article>

        <article className="panel calendar-details-panel">
          <header>
            <h3>Day Details</h3>
            <small>
              {selectedDateKey
                ? new Date(selectedDateKey).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Select a date"}
            </small>
          </header>

          {selectedDateKey === null ? (
            <p className="calendar-empty-copy">
              Pick a day to view subscriptions billing on that date.
            </p>
          ) : selectedDayItems.length === 0 ? (
            <p className="calendar-empty-copy">
              No scheduled billing for this day.
            </p>
          ) : (
            <ul className="calendar-bill-list">
              {selectedDayItems.map((item) => (
                <li key={item.id}>
                  <div>
                    <p>{item.name}</p>
                    <span>{item.cycle}</span>
                  </div>
                  <strong>{item.amount}</strong>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}

export default CalenderPage;
