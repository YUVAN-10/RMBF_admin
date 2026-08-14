import { Link } from "react-router-dom";
import { ArrowLeft, ArrowDown } from "lucide-react";
import MemberMiniProfile from "../rtor/MemberMiniProfile";
import ReferralTypeBadge from "./ReferralTypeBadge";
import { formatReferralDateLong, formatReferralTime } from "../../utils/formatReferralDate";

export default function ReferralDetails({ referral, referrerMember, connectorMember, referredMember }) {
  const isConnect = referral.type === "connect";

  return (
    <div className="space-y-6">
      <Link
        to="/referrals"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Referrals
      </Link>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-fade-in">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {isConnect ? "Connect" : "Self Referral"}
          </p>
          <ReferralTypeBadge type={referral.type} />
        </div>

        <div className="mt-5 flex flex-col items-center gap-4">
          <div>
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {isConnect ? "Original Referrer" : "From"}
            </p>
            <MemberMiniProfile
              name={referral.referrerName}
              ridNo={referrerMember?.ridNo}
              image={referrerMember?.profileImage}
              layout="column"
              size="lg"
            />
          </div>

          <ArrowDown size={20} className="text-primary" />

          {isConnect && (
            <>
              <div>
                <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Connector
                </p>
                <MemberMiniProfile
                  name={referral.connectorName}
                  ridNo={connectorMember?.ridNo}
                  image={connectorMember?.profileImage}
                  layout="column"
                  size="lg"
                />
              </div>

              <ArrowDown size={20} className="text-primary" />
            </>
          )}

          <div>
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {isConnect ? "Connected To" : "Referred To"}
            </p>
            <MemberMiniProfile
              name={referral.referredUserName}
              ridNo={referredMember?.ridNo}
              image={referredMember?.profileImage}
              layout="column"
              size="lg"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Date</p>
            <p className="mt-1 text-sm text-text">{formatReferralDateLong(referral.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Time</p>
            <p className="mt-1 text-sm text-text">{formatReferralTime(referral.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Type</p>
            <p className="mt-1 text-sm text-text">{isConnect ? "Connect" : "Self Referral"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
