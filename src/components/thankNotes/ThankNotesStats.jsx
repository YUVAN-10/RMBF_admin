import { CalendarDays, HeartHandshake, Sparkles, IndianRupee } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const statsMap = [
  {
    label: "Total Thank Notes",
    icon: HeartHandshake,
    color: "bg-primary-light text-primary",
    valueKey: "total",
  },
  {
    label: "This Month",
    icon: CalendarDays,
    color: "bg-secondary text-white",
    valueKey: "month",
  },
  {
    label: "Today",
    icon: Sparkles,
    color: "bg-accent/10 text-accent",
    valueKey: "today",
  },
  {
    label: "This Month's Value",
    icon: IndianRupee,
    color: "bg-success-light text-success",
    valueKey: "monthValue",
    format: formatCurrency,
  },
];

export default function ThankNotesStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsMap.map((item) => {
        const Icon = item.icon;
        const value = stats[item.valueKey];
        return (
          <div key={item.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-text">
                  {item.format ? item.format(value) : value}
                </p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.color}`}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
