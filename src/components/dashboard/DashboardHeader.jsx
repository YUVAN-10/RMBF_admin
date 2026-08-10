import { CalendarClock } from "lucide-react";

const today = new Date();
const formattedDate = today.toLocaleDateString("en-IN", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function DashboardHeader({ adminName = "Admin" }) {
  const initials = adminName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-secondary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Overview of RMBF Erode United activities and members
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-secondary">
          <CalendarClock size={16} className="text-primary" />
          <span>{formattedDate}</span>
        </div>

        <div className="hidden items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-text">{adminName}</p>
            <p className="text-xs text-text-secondary">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
