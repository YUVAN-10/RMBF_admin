import { CalendarHeart, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyEventsState({ hasFilters, onClearFilters, disabled }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
        <CalendarHeart size={26} />
      </div>

      {hasFilters ? (
        <>
          <h2 className="mt-4 text-base font-semibold text-text">No matching events found</h2>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">Try changing your search or filter.</p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg"
          >
            Clear filters
          </button>
        </>
      ) : (
        <>
          <h2 className="mt-4 text-base font-semibold text-text">No events yet</h2>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Create your first RMBF event to display it here.
          </p>
          {!disabled && (
            <Link
              to="/news-events/new"
              className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <Plus size={16} />
              Create Event
            </Link>
          )}
        </>
      )}
    </div>
  );
}
