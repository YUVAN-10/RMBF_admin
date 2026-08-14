import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, SquarePen, Ban, CheckCircle2, Loader2 } from "lucide-react";
import MemberAvatar from "./MemberAvatar";
import MemberStatusBadge from "./MemberStatusBadge";
import { updateMemberStatus } from "../../services/memberService";

export default function MemberRow({ member, serialNo }) {
  const [statusSaving, setStatusSaving] = useState(false);
  const isActive = member.status === "Active";

  const handleToggleStatus = async () => {
    if (isActive && !window.confirm(`Disable ${member.fullName}? They will lose access to the member app.`)) {
      return;
    }
    setStatusSaving(true);
    try {
      await updateMemberStatus(member.uid, isActive ? "Inactive" : "Active");
    } catch (error) {
      console.error("Error updating member status:", error);
      alert("Failed to update member status. Please try again.");
    } finally {
      setStatusSaving(false);
    }
  };

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
            to={`/members/${member.id}`}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary-light"
          >
            <Eye size={14} />
            View
          </Link>
          <Link
            to={`/members/${member.id}/edit`}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-bg"
          >
            <SquarePen size={14} />
            Edit
          </Link>
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={statusSaving}
            className={[
              "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              isActive
                ? "border-border text-danger hover:bg-danger-light"
                : "border-border text-success hover:bg-success-light",
            ].join(" ")}
          >
            {statusSaving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isActive ? (
              <Ban size={14} />
            ) : (
              <CheckCircle2 size={14} />
            )}
            {isActive ? "Active" : "Inactive"}
          </button>
        </div>
      </td>
    </tr>
  );
}
