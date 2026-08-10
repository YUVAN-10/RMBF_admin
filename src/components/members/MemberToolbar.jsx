import { Search, X } from "lucide-react";
import { memberStatuses } from "../../data/membersData";

export default function MemberToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  hasFilters,
  onClearFilters,
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, RID number, phone number, or company"
            className="w-full rounded-lg border border-border bg-bg py-2.5 pl-9 pr-3 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-40"
        >
          <option value="all">All Status</option>
          {memberStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-44"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="joining-desc">Joining Date (Newest)</option>
          <option value="joining-asc">Joining Date (Oldest)</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg"
          >
            <X size={15} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
