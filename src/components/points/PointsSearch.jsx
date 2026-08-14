import { Search, X } from "lucide-react";

export default function PointsSearch({ search, onSearchChange, hasFilters, onClearFilters }) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="relative min-w-0 flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by member name or RID number"
          className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg"
        >
          <X size={15} />
          Clear
        </button>
      )}
    </div>
  );
}
