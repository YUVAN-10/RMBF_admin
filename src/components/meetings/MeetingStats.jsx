import { CalendarDays, Clock, CheckCircle2, UserCheck } from "lucide-react";

const statsMap = [
  {
    key: "total",
    label: "Total Meetings",
    subtext: "All-time records",
    icon: CalendarDays,
    color: "bg-primary-light text-primary",
  },
  {
    key: "upcoming",
    label: "Upcoming",
    subtext: "Scheduled ahead",
    icon: Clock,
    color: "bg-accent/20 text-secondary",
  },
  {
    key: "completed",
    label: "Completed",
    subtext: "Attendance recorded",
    icon: CheckCircle2,
    color: "bg-success-light text-success",
  },
  {
    key: "totalAttendance",
    label: "Total Attendance",
    subtext: "Across all meetings",
    icon: UserCheck,
    color: "bg-secondary text-white",
  },
];

export default function MeetingStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
