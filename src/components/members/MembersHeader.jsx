import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function MembersHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-secondary">Members</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage and view RMBF Erode United members
        </p>
      </div>

      <Link
        to="/members/new"
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        <UserPlus size={16} />
        Add Member
      </Link>
    </div>
  );
}
