export type CalendarWeek = (number | null)[];

export function generateCalendar(year: number, month: number): CalendarWeek[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks: CalendarWeek[] = [];
  let week: CalendarWeek = [];

  // empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  while (week.length < 7) {
    week.push(null);
  }

  weeks.push(week);

  return weeks;
}
