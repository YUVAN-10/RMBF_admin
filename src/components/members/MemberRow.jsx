import { Link } from "react-router-dom";
import { Eye, SquarePen } from "lucide-react";
import MemberAvatar from "./MemberAvatar";
import MemberStatusBadge from "./MemberStatusBadge";

export default function MemberRow({ member, serialNo }) {
  return (
    <tr className="border-b border-border transition-colors last:border-0 hover:bg-bg">
      <td className="px-4 py-3 text-text-secondary">{serialNo}</td>
      <td className="px-4 py-3">
        <MemberAvatar name={member.fullName} image={member.profileImage} size="sm" />
      </td>
      <td className="px-4 py-3 font-medium text-text">{member.ridNo}</td>
      <td className="px-4 py-3 text-text">{member.fullName}</td>
      <td className="px-4 py-3 text-text-secondary">{member.phone}</td>
      <td className="px-4 py-3 text-text-secondary">{member.companyName}</td>
      <td className="px-4 py-3">
        <MemberStatusBadge status={member.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Link
            to={`/members/${member.uid}`}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary-light"
          >
            <Eye size={14} />
            View
          </Link>
          <Link
            to={`/members/${member.uid}/edit`}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-bg"
          >
            <SquarePen size={14} />
            Edit
          </Link>
        </div>
      </td>
    </tr>
  );
}
