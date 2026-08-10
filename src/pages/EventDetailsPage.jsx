import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEvents } from "../context/EventsContext";
import EventDetails from "../components/newsEvents/EventDetails";

export default function EventDetailsPage() {
  const { id } = useParams();
  const { getEventById } = useEvents();
  const event = getEventById(id);

  if (!event) {
    return (
      <div className="space-y-4">
        <Link
          to="/news-events"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to News & Events
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-text-secondary">
          Event not found.
        </div>
      </div>
    );
  }

  return <EventDetails event={event} />;
}
