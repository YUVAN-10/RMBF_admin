import { TrendingUp } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, subtext, trend, delay = 0 }) {
  return (
    <div
      className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          <Icon size={22} strokeWidth={2} />
        </div>
        {trend === "up" && (
          <span className="flex items-center gap-1 rounded-full bg-success-light px-2 py-1 text-xs font-medium text-success">
            <TrendingUp size={12} />
          </span>
        )}
      </div>

      <p className="mt-4 animate-count-up text-3xl font-semibold text-text">{value}</p>
      <p className="mt-1 text-sm font-medium text-text-secondary">{label}</p>

      {subtext && (
        <p className="mt-3 border-t border-border pt-3 text-xs text-text-secondary">
          {subtext}
        </p>
      )}
    </div>
  );
}
