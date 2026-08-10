import { HeartHandshake, CalendarCheck2, UserPlus, Repeat, PartyPopper } from "lucide-react";

const ICONS_BY_TYPE = {
  "thank-note": HeartHandshake,
  meeting: CalendarCheck2,
  member: UserPlus,
  r2r: Repeat,
  event: PartyPopper,
};

export default function RecentActivity({ activities }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-secondary">Recent Activity</h2>
        <p className="text-sm text-text-secondary">Latest updates across the club</p>
      </div>

      <ul>
        {activities.map((activity, index) => {
          const Icon = ICONS_BY_TYPE[activity.type] ?? CalendarCheck2;
          const isLast = index === activities.length - 1;
          return (
            <li
              key={activity.id}
              className={[
                "flex items-start gap-3 py-3",
                isLast ? "" : "border-b border-border",
              ].join(" ")}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                <Icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text">{activity.text}</p>
                <p className="mt-0.5 text-xs text-text-secondary">{activity.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
