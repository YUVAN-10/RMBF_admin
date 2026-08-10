import { Link } from "react-router-dom";
import { Eye, SquarePen, Phone, Building2 } from "lucide-react";
import MemberAvatar from "./MemberAvatar";
import MemberStatusBadge from "./MemberStatusBadge";

export default function MemberCard({ member }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <MemberAvatar name={member.fullName} image={member.profileImage} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text">{member.fullName}</p>
          <p className="text-xs text-text-secondary">{member.ridNo}</p>
        </div>
        <MemberStatusBadge status={member.status} />
      </div>

      <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs text-text-secondary">
        <p className="flex items-center gap-1.5">
          <Phone size={12} />
          {member.phone}
        </p>
        <p className="flex items-center gap-1.5">
          <Building2 size={12} />
          {member.companyName}
        </p>
      </div>

      <div className="mt-4 flex grid-cols-2 gap-2 border-t border-border pt-4 sm:grid">
        <Link
          to={`/members/${member.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-light px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <Eye size={16} />
          View Profile
        </Link>
        <Link
          to={`/members/${member.id}/edit`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-bg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-border/50"
        >
          <SquarePen size={16} />
          Edit
        </Link>
      </div>
    </div>
  );
}
