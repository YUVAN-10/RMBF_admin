import { Award } from "lucide-react";

export default function EmptyPointsState({ hasFilters, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
        <Award size={26} />
      </div>

      {hasFilters ? (
        <>
          <h2 className="mt-4 text-base font-semibold text-text">No matching members found</h2>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">Try changing your search.</p>
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
          <h2 className="mt-4 text-base font-semibold text-text">No points yet</h2>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Points earned by members from the User App will appear here.
          </p>
        </>
      )}
    </div>
  );
}
