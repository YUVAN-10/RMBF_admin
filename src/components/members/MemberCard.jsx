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

      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        <Link
          to={`/members/${member.uid}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-primary transition-colors hover:bg-primary-light"
        >
          <Eye size={14} />
          View
        </Link>
        <Link
          to={`/members/${member.uid}/edit`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-secondary transition-colors hover:bg-bg"
        >
          <SquarePen size={14} />
          Edit
        </Link>
      </div>
    </div>
  );
}
