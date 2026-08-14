import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function MeetingsHeader({
  title = "Meetings",
  subtitle = "Create meetings, generate attendance QR codes, and monitor member attendance.",
  createPath = "/meetings/new",
  createLabel = "Create Meeting",
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-secondary">{title}</h1>
        <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
      </div>

      <Link
        to={createPath}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        <Plus size={16} />
        {createLabel}
      </Link>
    </div>
  );
}
