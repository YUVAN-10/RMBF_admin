import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePoints } from "../context/PointsContext";
import { useMembers } from "../context/MembersContext";
import MemberPointsDetails from "../components/points/MemberPointsDetails";
import { getCurrentMonthId, MONTHLY_POINT_LIMIT } from "../utils/pointsMonth";

export default function MemberPointsDetailsPage() {
  const { memberUid, month } = useParams();
  const { getMemberById, loading: membersLoading } = useMembers();
  const { monthlyPoints, loading: pointsLoading } = usePoints();

  const loading = membersLoading || pointsLoading;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const member = getMemberById(memberUid);

  if (!member) {
    return (
      <div className="space-y-4">
        <Link
          to="/points"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to Points
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-text-secondary">
          Member not found.
        </div>
      </div>
    );
  }

  const currentMonth = getCurrentMonthId();
  const availableMonths = Array.from(new Set([currentMonth, ...monthlyPoints.map((e) => e.month)]))
    .sort()
    .reverse();

  const record = monthlyPoints.find((e) => e.memberUid === memberUid && e.month === month);
  const entry = {
    points: record?.points ?? 0,
    maxPoints: record?.maxPoints ?? MONTHLY_POINT_LIMIT,
  };

  const memberHistory = monthlyPoints
    .filter((e) => e.memberUid === memberUid)
    .sort((a, b) => (a.month < b.month ? 1 : -1));

  return (
    <MemberPointsDetails
      member={member}
      month={month}
      entry={entry}
      memberHistory={memberHistory}
      availableMonths={availableMonths}
    />
  );
}
