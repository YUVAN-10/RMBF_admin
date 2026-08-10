import { Search, X } from "lucide-react";
import MemberFilterSelect from "./MemberFilterSelect";

export default function RToRToolbar({
  search,
  onSearchChange,
  fromMember,
  onFromMemberChange,
  members,
  memberCounts,
  totalCount,
  hasFilters,
  onClearFilters,
  currentTermCount,
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
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
          {search.trim() !== "" && (
            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm font-medium text-text-secondary whitespace-nowrap">
              <span className="h-2 w-2 rounded-full bg-success"></span>
              This Term: {currentTermCount}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <MemberFilterSelect
            members={members}
            memberCounts={memberCounts}
            totalCount={totalCount}
            value={fromMember}
            onChange={onFromMemberChange}
          />

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
    </div>
  );
}
