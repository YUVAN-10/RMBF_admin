import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useReferrals } from "../context/ReferralsContext";
import { useMembers } from "../context/MembersContext";
import ReferralDetails from "../components/referrals/ReferralDetails";

export default function ReferralDetailsPage() {
  const { id } = useParams();
  const { referrals, loading } = useReferrals();
  const { getMemberById } = useMembers();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const referral = referrals.find((r) => r.id === id) ?? null;

  if (!referral) {
    return (
      <div className="space-y-4">
        <Link
          to="/referrals"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to Referrals
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-text-secondary">
          Referral not found.
        </div>
      </div>
    );
  }

  const referrerMember = getMemberById(referral.referrerId);
  const connectorMember = getMemberById(referral.connectorId);
  const referredMember = getMemberById(referral.referredUserId);

  return (
    <ReferralDetails
      referral={referral}
      referrerMember={referrerMember}
      connectorMember={connectorMember}
      referredMember={referredMember}
    />
  );
}
