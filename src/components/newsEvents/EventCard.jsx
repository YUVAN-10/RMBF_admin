import { Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Eye, SquarePen, ImageIcon, Zap } from "lucide-react";
import EventStatusBadge from "./EventStatusBadge";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";

export default function EventCard({ event, onActivate, canActivate }) {
  const isInactive = event.status === "Inactive";

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-fade-in">
      <div className="relative aspect-video w-full overflow-hidden bg-primary-light">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary">
            <ImageIcon size={32} />
          </div>
        )}
        <div className="absolute right-2.5 top-2.5">
          <EventStatusBadge event={event} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-text">{event.name}</h3>

        <div className="mt-3 space-y-1.5 text-xs text-text-secondary">
          <p className="flex items-center gap-1.5">
            <CalendarDays size={13} />
            {formatDate(event.eventDate)}
          </p>
          <p className="flex items-center gap-1.5">
            <Clock size={13} />
            {formatTime(event.eventTime)}
          </p>
          {event.location && (
            <p className="flex items-center gap-1.5">
              <MapPin size={13} />
              {event.location}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          <Link
            to={`/news-events/${event.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-primary transition-colors hover:bg-primary-light"
          >
            <Eye size={14} />
            View
          </Link>
          <Link
            to={`/news-events/${event.id}/edit`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-secondary transition-colors hover:bg-bg"
          >
            <SquarePen size={14} />
            Edit
          </Link>
        </div>

        {isInactive && (
          <button
            type="button"
            onClick={() => onActivate(event.id)}
            disabled={!canActivate}
            title={!canActivate ? "Maximum 5 active events allowed." : undefined}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-border disabled:text-text-secondary"
          >
            <Zap size={14} />
            Activate
          </button>
        )}
      </div>
    </div>
  );
}
