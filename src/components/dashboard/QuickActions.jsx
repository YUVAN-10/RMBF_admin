import { UserPlus, CalendarPlus, CalendarClock } from "lucide-react";

const actions = [
  { label: "Add Member", icon: UserPlus },
  { label: "Create Event", icon: CalendarPlus },
  { label: "Create Meeting", icon: CalendarClock },
];

export default function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
      <h2 className="mb-4 text-base font-semibold text-secondary">Quick Actions</h2>

      <div className="flex flex-col gap-2">
        {actions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
