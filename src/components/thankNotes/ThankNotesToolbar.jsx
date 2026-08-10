import { Search, X } from "lucide-react";

const filterOptions = [
  { value: "all", label: "All terms" },
  { value: "term-1", label: "Term 1 (Jan - Jun)" },
  { value: "term-2", label: "Term 2 (Jul - Dec)" },
];

export default function ThankNotesToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  hasFilters,
  onClearFilters,
  currentTermCount,
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Thank Notes by sender or recipient"
              className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {search.trim() !== "" && (
            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm font-medium text-text-secondary whitespace-nowrap">
              <span className="h-2 w-2 rounded-full bg-success"></span>
              This Term: {currentTermCount}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>



          {hasFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg"
            >
              <X size={16} />
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
