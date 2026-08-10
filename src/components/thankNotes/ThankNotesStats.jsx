import { CalendarDays, HeartHandshake, Sparkles, IndianRupee } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ThankNotesStats({ stats }) {
  const statsMap = [
    {
      label: "Total Thank Notes",
      icon: HeartHandshake,
      color: "bg-primary-light text-primary",
      valueKey: "total",
    },
    {
      label: `${stats.currentTermName ? stats.currentTermName.split(' ')[0] + ' ' + stats.currentTermName.split(' ')[1] : 'This Term'} Value`,
      icon: IndianRupee,
      color: "bg-accent/10 text-accent",
      valueKey: "currentTermValue",
      format: formatCurrency,
    },
    {
      label: "Highest by Person",
      icon: Sparkles,
      color: "bg-success-light text-success",
      valueKey: "topUserCount",
      subtextKey: "topUserName",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                {item.subtextKey && (
                  <p className="mt-1 text-xs text-text-secondary truncate">
                    {stats[item.subtextKey] || "No records"} in this term
                  </p>
                )}
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
