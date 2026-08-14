import { CalendarDays } from "lucide-react";
import { formatMonthLabel } from "../../utils/pointsMonth";

export default function MonthSelector({ months, value, onChange }) {
  return (
    <div className="relative">
      <CalendarDays
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {formatMonthLabel(month)}
          </option>
        ))}
      </select>
    </div>
  );
}
