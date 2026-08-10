import { Link } from "react-router-dom";
import { ArrowLeft, SquarePen, CalendarDays, Clock, MapPin, ImageIcon } from "lucide-react";
import EventStatusBadge from "./EventStatusBadge";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";

export default function EventDetails({ event }) {
  return (
    <div className="space-y-6">
      <Link
        to="/news-events"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to News & Events
      </Link>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm animate-fade-in">
        <div className="relative mx-auto w-full max-w-2xl overflow-hidden bg-primary-light sm:mt-6 sm:rounded-xl">
          <div className="aspect-[21/9] w-full">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-primary">
                <ImageIcon size={40} />
              </div>
            )}
          </div>
          <div className="absolute right-3 top-3">
            <EventStatusBadge event={event} />
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-text">{event.name}</h1>
              <p className="mt-1 text-xs text-text-secondary">Created {formatDate(event.createdAt)}</p>
            </div>
            <Link
              to={`/news-events/${event.id}/edit`}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <SquarePen size={16} />
              Edit Event
            </Link>
          </div>

          {event.description && (
            <p className="mt-4 text-sm leading-6 text-text-secondary">{event.description}</p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-text">
              <CalendarDays size={16} className="text-primary" />
              {formatDate(event.eventDate)}
            </div>
            <div className="flex items-center gap-2 text-sm text-text">
              <Clock size={16} className="text-primary" />
              {formatTime(event.eventTime)}
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-text">
                <MapPin size={16} className="text-primary" />
                {event.location}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
