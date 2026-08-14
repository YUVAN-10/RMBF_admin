import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import ReferralTypeBadge from "./ReferralTypeBadge";
import { formatReferralDate, formatReferralTime, isToday } from "../../utils/formatReferralDate";

const RECENT_COUNT = 5;

export default function RecentReferrals({ referrals }) {
  const recent = referrals.slice(0, RECENT_COUNT);

  if (recent.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Clock size={16} className="text-text-secondary" />
        <h2 className="text-sm font-semibold text-text">Recent Referrals</h2>
      </div>

      <div className="divide-y divide-border">
        {recent.map((referral) => {
          const isConnect = referral.type === "connect";
          const when = isToday(referral.createdAt)
            ? `Today, ${formatReferralTime(referral.createdAt)}`
            : `${formatReferralDate(referral.createdAt)}, ${formatReferralTime(referral.createdAt)}`;

          return (
            <Link
              key={referral.id}
              to={`/referrals/${referral.id}`}
              className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm transition-colors hover:bg-bg"
            >
              <span className="flex min-w-0 flex-wrap items-center gap-1.5 font-medium text-text">
                <span className="truncate">{referral.referrerName}</span>
                <ArrowRight size={12} className="shrink-0 text-text-secondary" />
                {isConnect && (
                  <>
                    <span className="truncate">{referral.connectorName}</span>
                    <ArrowRight size={12} className="shrink-0 text-text-secondary" />
                  </>
                )}
                <span className="truncate">{referral.referredUserName}</span>
              </span>

              <span className="flex items-center gap-2 text-xs text-text-secondary">
                <ReferralTypeBadge type={referral.type} />
                {when}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
