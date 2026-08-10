import { Link } from "react-router-dom";
import { Eye, SquarePen, Ban } from "lucide-react";
import MeetingRow from "./MeetingRow";
import MeetingStatusBadge from "./MeetingStatusBadge";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { isMeetingEditable } from "../../utils/meetingStatus";

export default function MeetingsTable({ meetings, startSerialNo, totalActiveMembers, onCancelClick }) {
  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card shadow-sm md:block">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-text-secondary">
              <th className="px-4 py-3 font-medium">S.No</th>
              <th className="px-4 py-3 font-medium">Meeting Name</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Place</th>
              <th className="px-4 py-3 font-medium">Attendance</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting, index) => (
              <MeetingRow
                key={meeting.id}
                meeting={meeting}
                serialNo={startSerialNo + index}
                totalActiveMembers={totalActiveMembers}
                onCancelClick={onCancelClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {meetings.map((meeting) => {
          const editable = isMeetingEditable(meeting);
          const present = meeting.attendance.length;
          return (
            <div key={meeting.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-text">{meeting.meetingName}</p>
                <MeetingStatusBadge meeting={meeting} />
              </div>
              <div className="mt-2 space-y-1 text-xs text-text-secondary">
                <p>
                  {formatDate(meeting.meetingDate)} &bull; {formatTime(meeting.meetingTime)}
                </p>
                <p>{meeting.place}</p>
                <p>
                  Attendance: {present} / {totalActiveMembers}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                <Link
                  to={`/meetings/${meeting.id}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-primary transition-colors hover:bg-primary-light"
                >
                  <Eye size={14} />
                  View
                </Link>
                {editable && (
                  <>
                    <Link
                      to={`/meetings/${meeting.id}/edit`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-secondary transition-colors hover:bg-bg"
                    >
                      <SquarePen size={14} />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onCancelClick(meeting)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-danger transition-colors hover:bg-danger-light"
                    >
                      <Ban size={14} />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
