import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import MemberMiniProfile from "../rtor/MemberMiniProfile";
import PointsProgress from "./PointsProgress";
import { formatMonthLabel, getCurrentMonthId } from "../../utils/pointsMonth";

export default function PointsRow({ entry, serialNo, onEdit }) {
  const { member, points, maxPoints, month } = entry;
  const remaining = Math.max(0, maxPoints - points);
  const isCurrentMonth = month === getCurrentMonthId();

  return (
    <tr className="border-b border-border transition-colors last:border-0 hover:bg-bg">
      <td className="px-4 py-3 text-text-secondary">{serialNo}</td>
      <td className="px-4 py-3">
        <MemberMiniProfile name={member.fullName} ridNo={member.ridNo} image={member.profileImage} />
      </td>
      <td className="px-4 py-3 text-text-secondary">{member.ridNo || "—"}</td>
      <td className="px-4 py-3 text-text-secondary">{formatMonthLabel(month)}</td>
      <td className="px-4 py-3 tabular-nums font-medium text-text">{points.toLocaleString()}</td>
      <td className="px-4 py-3 tabular-nums text-text-secondary">{remaining.toLocaleString()}</td>
      <td className="px-4 py-3">
        <PointsProgress points={points} maxPoints={maxPoints} size="sm" />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            to={`/points/${member.uid}/${month}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
          >
            <Eye size={13} />
            View
          </Link>
          {isCurrentMonth && (
            <button
              type="button"
              onClick={() => onEdit?.(entry)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
            >
              <Pencil size={13} />
              Edit
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
