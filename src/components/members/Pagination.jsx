import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
      <p className="text-sm text-text-secondary">
        Showing <span className="font-medium text-text">{rangeStart}-{rangeEnd}</span> of{" "}
        <span className="font-medium text-text">{totalItems}</span> members
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={[
                "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-bg",
              ].join(" ")}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
