import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function NewsEventsHeader({ disabled }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-secondary">News & Events</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Create and manage RMBF Erode United events and announcements
        </p>
      </div>

      {disabled ? (
        <button
          type="button"
          disabled
          title="Maximum 5 active events allowed."
          className="flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-border px-4 py-2.5 text-sm font-medium text-text-secondary"
        >
          <Plus size={16} />
          Create Event
        </button>
      ) : (
        <Link
          to="/news-events/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <Plus size={16} />
          Create Event
        </Link>
      )}
    </div>
  );
}
