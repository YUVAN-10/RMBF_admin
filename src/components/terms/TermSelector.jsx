import { CalendarRange } from "lucide-react";
import { formatTermLabel } from "../../utils/termPeriod";

export default function TermSelector({ terms, value, onChange }) {
  return (
    <div className="relative">
      <CalendarRange
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
      />
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {terms.map((term) => (
          <option key={term.termNumber} value={term.termNumber}>
            {formatTermLabel(term)}
          </option>
        ))}
      </select>
    </div>
  );
}
