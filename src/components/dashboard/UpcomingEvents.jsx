import { CalendarHeart, Clock, ChevronRight } from "lucide-react";

export default function UpcomingEvents({ events }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-secondary">Upcoming Events</h2>
        <p className="text-sm text-text-secondary">Next scheduled events</p>
      </div>

      <ul className="space-y-2">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex items-center gap-3 rounded-lg border border-border p-2.5 transition-colors hover:bg-bg"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <CalendarHeart size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">{event.name}</p>
              <p className="flex items-center gap-1 text-xs text-text-secondary">
                <span>{event.date}</span>
                <span className="text-border">&bull;</span>
                <Clock size={12} />
                <span>{event.time}</span>
              </p>
            </div>

            <button
              type="button"
              className="flex shrink-0 items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary-light"
            >
              View
              <ChevronRight size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
