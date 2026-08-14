import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import PointsRow from "./PointsRow";
import PointsProgress from "./PointsProgress";
import { formatMonthLabel, getCurrentMonthId } from "../../utils/pointsMonth";

export default function PointsTable({ entries, startSerialNo, onEdit }) {
  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card shadow-sm md:block">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-text-secondary">
              <th className="px-4 py-3 font-medium">S.No</th>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">RID No</th>
              <th className="px-4 py-3 font-medium">Month</th>
              <th className="px-4 py-3 font-medium">Points</th>
              <th className="px-4 py-3 font-medium">Remaining</th>
              <th className="px-4 py-3 font-medium">Progress</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <PointsRow key={entry.member.uid} entry={entry} serialNo={startSerialNo + index} onEdit={onEdit} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {entries.map((entry) => {
          const { member, points, maxPoints, month } = entry;
          const remaining = Math.max(0, maxPoints - points);
          const isCurrentMonth = month === getCurrentMonthId();
          return (
            <div
              key={member.uid}
              className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-bg"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-text">{member.fullName}</p>
                <span className="text-xs text-text-secondary">RID: {member.ridNo || "—"}</span>
              </div>
              <p className="mt-1 text-xs text-text-secondary">{formatMonthLabel(month)}</p>

              <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
                <span>
                  Points: <span className="font-medium text-text">{points.toLocaleString()}</span>
                </span>
                <span>
                  Remaining: <span className="font-medium text-text">{remaining.toLocaleString()}</span>
                </span>
              </div>

              <div className="mt-2">
                <PointsProgress points={points} maxPoints={maxPoints} size="sm" />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Link
                  to={`/points/${member.uid}/${month}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
                >
                  <Eye size={13} />
                  View
                </Link>
                {isCurrentMonth && (
                  <button
                    type="button"
                    onClick={() => onEdit?.(entry)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
