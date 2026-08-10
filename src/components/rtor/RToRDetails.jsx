import { Link } from "react-router-dom";
import { ArrowLeft, ArrowDown } from "lucide-react";
import MemberMiniProfile from "./MemberMiniProfile";
import { formatRecordDateLong, formatRecordTime, formatRecordDateTime } from "../../utils/formatRToRDate";

export default function RToRDetails({ record, fromMember, toMember }) {
  return (
    <div className="space-y-6">
      <Link
        to="/r-to-r"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to R to R
      </Link>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">R to R</p>

        <div className="mt-5 flex flex-col items-center gap-4">
          <div>
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">
              From
            </p>
            <MemberMiniProfile
              name={record.fromName}
              ridNo={fromMember?.ridNo}
              image={fromMember?.profileImage}
              layout="column"
              size="lg"
            />
          </div>

          <ArrowDown size={20} className="text-primary" />

          <div>
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">To</p>
            <MemberMiniProfile
              name={record.toName}
              ridNo={toMember?.ridNo}
              image={toMember?.profileImage}
              layout="column"
              size="lg"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Date</p>
            <p className="mt-1 text-sm text-text">{formatRecordDateLong(record.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Time</p>
            <p className="mt-1 text-sm text-text">{formatRecordTime(record.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Created</p>
            <p className="mt-1 text-sm text-text">{formatRecordDateTime(record.createdAt)}</p>
          </div>
        </div>

        {record.message && (
          <div className="mt-6 rounded-lg border border-border bg-bg p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Message</p>
            <p className="mt-2 text-sm leading-6 text-text">&ldquo;{record.message}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}
