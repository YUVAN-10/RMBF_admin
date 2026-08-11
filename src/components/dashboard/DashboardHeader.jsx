import { Calendar } from "lucide-react";
import ProfileDropdown from "../layout/ProfileDropdown";

export default function DashboardHeader({ termFilter, setTermFilter }) {
  return (
    <div className="relative z-30 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-center animate-fade-in border-b border-border/40 pb-4">
      {/* Left: Title & Subtitle */}
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight text-secondary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Overview of RMBF Erode United activities and members
        </p>
      </div>

      {/* Center: Term Selector */}
      <div className="flex items-center justify-start lg:justify-center">
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2 shadow-xs hover:border-primary/50 transition-colors">
          <Calendar size={18} className="text-primary shrink-0" />
          <select
            value={termFilter}
            onChange={(e) => setTermFilter(e.target.value)}
            className="border-0 bg-transparent text-sm font-semibold text-text focus:ring-0 cursor-pointer outline-none pr-1"
          >
            <option value="term1">Term 1 (Jan - Jun)</option>
            <option value="term2">Term 2 (Jul - Dec)</option>
          </select>
        </div>
      </div>

      {/* Right: Firebase Profile with Dropdown */}
      <div className="flex items-center justify-start lg:justify-end">
        <ProfileDropdown />
      </div>
    </div>
  );
}
