import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, History, Pencil } from "lucide-react";
import MemberMiniProfile from "../rtor/MemberMiniProfile";
import PointsProgress from "./PointsProgress";
import MonthSelector from "./MonthSelector";
import PointTransactionHistory from "./PointTransactionHistory";
import EditPointsModal from "./EditPointsModal";
import { formatMonthLabel, getCurrentMonthId } from "../../utils/pointsMonth";

export default function MemberPointsDetails({ member, month, entry, memberHistory, availableMonths }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const remaining = Math.max(0, entry.maxPoints - entry.points);
  const isCurrentMonth = month === getCurrentMonthId();

  return (
    <div className="space-y-6">
      <Link
        to="/points"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Points
      </Link>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <MemberMiniProfile name={member.fullName} ridNo={member.ridNo} image={member.profileImage} size="md" />
          <div className="flex items-center gap-2">
            <MonthSelector
              months={availableMonths}
              value={month}
              onChange={(value) => navigate(`/points/${member.uid}/${value}`)}
            />
            {isCurrentMonth && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
              >
                <Pencil size={14} />
                Edit Points
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Month</p>
            <p className="mt-1 text-sm text-text">{formatMonthLabel(month)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Current Points</p>
            <p className="mt-1 text-sm font-semibold text-text">{entry.points.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Maximum</p>
            <p className="mt-1 text-sm text-text">{entry.maxPoints.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Remaining</p>
            <p className="mt-1 text-sm text-text">{remaining.toLocaleString()}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-text-secondary">Progress</p>
            <PointsProgress points={entry.points} maxPoints={entry.maxPoints} />
          </div>
        </div>
      </div>

      <PointTransactionHistory memberUid={member.uid} month={month} />

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
        <div className="mb-4 flex items-center gap-2">
          <History size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-secondary">Monthly History</h2>
        </div>

        {memberHistory.length === 0 ? (
          <p className="text-sm text-text-secondary">No monthly point history yet.</p>
        ) : (
          <div className="space-y-4">
            {memberHistory.map((record) => (
              <div key={record.month}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-text">{formatMonthLabel(record.month)}</span>
                  {record.month === month && (
                    <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                      Viewing
                    </span>
                  )}
                </div>
                <PointsProgress points={record.points} maxPoints={record.maxPoints} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && <EditPointsModal member={member} entry={entry} onClose={() => setEditing(false)} />}
    </div>
  );
}
