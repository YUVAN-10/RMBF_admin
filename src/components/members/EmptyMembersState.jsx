import { Users, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyMembersState({ hasFilters, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
        <Users size={26} />
      </div>

      {hasFilters ? (
        <>
          <h2 className="mt-4 text-base font-semibold text-text">No members found</h2>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Try changing your search or filter.
          </p>
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
          <h2 className="mt-4 text-base font-semibold text-text">No members added yet</h2>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Get started by adding your first RMBF Erode United member.
          </p>
          <Link
            to="/members/new"
            className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <UserPlus size={16} />
            Add Member
          </Link>
        </>
      )}
    </div>
  );
}
