import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRToR } from "../context/RToRContext";
import { useMembers } from "../context/MembersContext";
import RToRDetails from "../components/rtor/RToRDetails";
import { resolveMemberName, resolveMemberId } from "../utils/nameResolver";

export default function RToRDetailsPage() {
  const { id } = useParams();
  const { rtorRecords } = useRToR();
  const { members, getMemberById } = useMembers();

  const rawRecord = rtorRecords.find((r) => r.id === id) ?? null;

  if (!rawRecord) {
    return (
      <div className="space-y-4">
        <Link
          to="/r-to-r"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to R to R
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-text-secondary">
          R to R record not found.
        </div>
      </div>
    );
  }

  const fromName = resolveMemberName(rawRecord, "from", members);
  const toName = resolveMemberName(rawRecord, "to", members);
  const fromUserId = resolveMemberId(rawRecord, "from") || rawRecord.fromUserId;
  const toUserId = resolveMemberId(rawRecord, "to") || rawRecord.toUserId;

  const record = {
    ...rawRecord,
    fromName,
    toName,
    fromUserId,
    toUserId,
  };

  const fromMember = getMemberById(fromUserId);
  const toMember = getMemberById(toUserId);

  return <RToRDetails record={record} fromMember={fromMember} toMember={toMember} />;
}
