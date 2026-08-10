import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { initialRToR } from "../data/rtorData";
import { useMembers } from "../context/MembersContext";
import RToRDetails from "../components/rtor/RToRDetails";

export default function RToRDetailsPage() {
  const { id } = useParams();
  const { getMemberById } = useMembers();
  const record = initialRToR.find((r) => r.id === id) ?? null;

  if (!record) {
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

  const fromMember = getMemberById(record.fromUserId);
  const toMember = getMemberById(record.toUserId);

  return <RToRDetails record={record} fromMember={fromMember} toMember={toMember} />;
}
