import { useEffect, useState } from "react";
import { Circle, FileSpreadsheet } from "lucide-react";
import { POINT_CATEGORIES, formatPointRange } from "../../utils/pointCategory";

function CategoryCard({ category, count, onExport, index }) {
  const [emptyMessage, setEmptyMessage] = useState(false);

  useEffect(() => {
    if (!emptyMessage) return;
    const timer = setTimeout(() => setEmptyMessage(false), 3000);
    return () => clearTimeout(timer);
  }, [emptyMessage]);

  const handleExport = () => {
    if (count === 0) {
      setEmptyMessage(true);
      return;
    }
    setEmptyMessage(false);
    onExport(category.key);
  };

  return (
    <div
      className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{category.label} Members</p>
          <p className="mt-2 text-2xl font-semibold text-text">{count.toLocaleString()}</p>
          <p className="text-xs text-text-secondary">{count === 1 ? "Member" : "Members"}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${category.badgeClass}`}>
          <Circle size={18} fill="currentColor" />
        </div>
      </div>
      <p className="mt-3 border-t border-border pt-2 text-xs text-text-secondary">{formatPointRange(category)}</p>
      <button
        type="button"
        onClick={handleExport}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
      >
        <FileSpreadsheet size={13} />
        Export {category.label}
      </button>
      {emptyMessage && <p className="mt-2 text-center text-xs text-danger">No members found in this point range.</p>}
    </div>
  );
}

export default function PointCategoryCards({ categorizedEntries, onExport }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {POINT_CATEGORIES.map((category, index) => (
        <CategoryCard
          key={category.key}
          category={category}
          count={categorizedEntries[category.key]?.length ?? 0}
          onExport={onExport}
          index={index}
        />
      ))}
    </div>
  );
}
