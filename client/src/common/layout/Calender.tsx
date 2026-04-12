import React, { useState } from "react";
import { generateCalendar } from "../../utils/calenderUtils";
import "./calendar.css";

interface Props {
  subscriptions?: Subscription[];
}

interface Subscription {
  id: string;
  name: string;
  nextBillingDate: number; // timestamp
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function SubscriptionCalendar({ subscriptions = [] }: Props) {
  const today = new Date();

  const [month, setMonth] = useState<number>(today.getMonth());
  const [year, setYear] = useState<number>(today.getFullYear());

  const calendar = generateCalendar(year, month);

  // 🔥 Get subscriptions for a specific day
  const getSubsForDay = (day: number | null): Subscription[] => {
    if (!day) return [];

    return subscriptions.filter((sub) => {
      const date = new Date(sub.nextBillingDate);

      return (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
      );
    });
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="calendar-wrapper">
      {/* Header */}
      <div className="calendar-header">
        <button onClick={prevMonth}>←</button>
        <h2>
          {monthNames[month]} {year}
        </h2>
        <button onClick={nextMonth}>→</button>
      </div>

      {/* Week labels */}
      <div className="calendar-grid week">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="calendar-grid">
        {calendar.flat().map((day, idx) => {
          const subs = getSubsForDay(day);

          return (
            <div key={idx} className={`day ${day ? "" : "empty"}`}>
              {day && (
                <>
                  <div className="date-number">{day}</div>

                  <div className="subs">
                    {subs.map((sub) => (
                      <div key={sub.id} className="sub-chip">
                        {sub.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
