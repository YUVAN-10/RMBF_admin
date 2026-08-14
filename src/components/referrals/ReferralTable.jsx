import { Link } from "react-router-dom";
import { ArrowDown, Eye } from "lucide-react";
import ReferralRow from "./ReferralRow";
import ReferralTypeBadge from "./ReferralTypeBadge";
import MemberMiniProfile from "../rtor/MemberMiniProfile";
import { formatReferralDate, formatReferralTime } from "../../utils/formatReferralDate";

export default function ReferralTable({ referrals, startSerialNo, getMember }) {
  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card shadow-sm md:block">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-text-secondary">
              <th className="px-4 py-3 font-medium">S.No</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Referrer</th>
              <th className="px-4 py-3 font-medium">Connector</th>
              <th className="px-4 py-3 font-medium">Referred To</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral, index) => (
              <ReferralRow
                key={referral.id}
                referral={referral}
                serialNo={startSerialNo + index}
                getMember={getMember}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {referrals.map((referral) => {
          const isConnect = referral.type === "connect";
          const referrerMember = getMember(referral.referrerId);
          const connectorMember = getMember(referral.connectorId);
          const referredMember = getMember(referral.referredUserId);

          return (
            <div
              key={referral.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-bg"
            >
              <div className="mb-3 flex items-center justify-between">
                <ReferralTypeBadge type={referral.type} />
                <span className="text-xs text-text-secondary">
                  {formatReferralDate(referral.createdAt)} &middot; {formatReferralTime(referral.createdAt)}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <MemberMiniProfile
                  name={referral.referrerName}
                  ridNo={referrerMember?.ridNo}
                  image={referrerMember?.profileImage}
                  layout="column"
                  size="md"
                />
                <ArrowDown size={16} className="text-border" />
                {isConnect && (
                  <>
                    <MemberMiniProfile
                      name={referral.connectorName}
                      ridNo={connectorMember?.ridNo}
                      image={connectorMember?.profileImage}
                      layout="column"
                      size="md"
                    />
                    <ArrowDown size={16} className="text-border" />
                  </>
                )}
                <MemberMiniProfile
                  name={referral.referredUserName}
                  ridNo={referredMember?.ridNo}
                  image={referredMember?.profileImage}
                  layout="column"
                  size="md"
                />
              </div>

              <Link
                to={`/referrals/${referral.id}`}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
              >
                <Eye size={13} />
                View
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
