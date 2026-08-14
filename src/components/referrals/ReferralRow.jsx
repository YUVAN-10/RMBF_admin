import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import MemberMiniProfile from "../rtor/MemberMiniProfile";
import ReferralTypeBadge from "./ReferralTypeBadge";
import { formatReferralDate, formatReferralTime } from "../../utils/formatReferralDate";

export default function ReferralRow({ referral, serialNo, getMember }) {
  const isConnect = referral.type === "connect";
  const referrerMember = getMember(referral.referrerId);
  const connectorMember = getMember(referral.connectorId);
  const referredMember = getMember(referral.referredUserId);

  return (
    <tr className="border-b border-border transition-colors last:border-0 hover:bg-bg">
      <td className="px-4 py-3 text-text-secondary">{serialNo}</td>
      <td className="px-4 py-3">
        <ReferralTypeBadge type={referral.type} />
      </td>
      <td className="px-4 py-3">
        <MemberMiniProfile
          name={referral.referrerName}
          ridNo={referrerMember?.ridNo}
          image={referrerMember?.profileImage}
        />
      </td>
      <td className="px-4 py-3">
        {isConnect ? (
          <MemberMiniProfile
            name={referral.connectorName}
            ridNo={connectorMember?.ridNo}
            image={connectorMember?.profileImage}
          />
        ) : (
          <span className="text-text-secondary">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <MemberMiniProfile
          name={referral.referredUserName}
          ridNo={referredMember?.ridNo}
          image={referredMember?.profileImage}
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-text-secondary">{formatReferralDate(referral.createdAt)}</td>
      <td className="px-4 py-3 whitespace-nowrap text-text-secondary">{formatReferralTime(referral.createdAt)}</td>
      <td className="px-4 py-3">
        <Link
          to={`/referrals/${referral.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
        >
          <Eye size={13} />
          View
        </Link>
      </td>
    </tr>
  );
}
