import { Repeat, CalendarDays, Sparkles } from "lucide-react";

export default function RToRStats({ stats }) {
  const statsMap = [
    {
      key: "total",
      label: "Total R to R",
      subtext: "All-time connections",
      icon: Repeat,
      color: "bg-primary-light text-primary",
    },
    {
      key: "currentTerm",
      label: stats.currentTermName || "This Term",
      subtext: "Connections in this term",
      icon: CalendarDays,
      color: "bg-secondary text-white",
    },
    {
      key: "topUserCount",
      label: "Highest by Person",
      subtext: `${stats.topUserName || "No records"} in this term`,
      icon: Sparkles,
      color: "bg-accent/10 text-accent",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statsMap.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-fade-in"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-text">{stats[item.key]}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.color}`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="mt-3 border-t border-border pt-2 text-xs text-text-secondary">{item.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
