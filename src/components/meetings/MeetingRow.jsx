import { Link } from "react-router-dom";
import { Eye, SquarePen, Ban } from "lucide-react";
import MeetingStatusBadge from "./MeetingStatusBadge";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { isMeetingEditable } from "../../utils/meetingStatus";

export default function MeetingRow({ meeting, serialNo, totalActiveMembers, onCancelClick }) {
  const editable = isMeetingEditable(meeting);
  const present = meeting.attendance.length;

  return (
    <tr className="border-b border-border transition-colors last:border-0 hover:bg-bg">
      <td className="px-4 py-3 text-text-secondary">{serialNo}</td>
      <td className="px-4 py-3 font-medium text-text">{meeting.meetingName}</td>
      <td className="px-4 py-3 text-text-secondary">{formatDate(meeting.meetingDate)}</td>
      <td className="px-4 py-3 text-text-secondary">{formatTime(meeting.meetingTime)}</td>
      <td className="px-4 py-3 text-text-secondary">{meeting.place}</td>
      <td className="px-4 py-3 tabular-nums text-text-secondary">
        {present} / {totalActiveMembers}
      </td>
      <td className="px-4 py-3">
        <MeetingStatusBadge meeting={meeting} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Link
            to={`/meetings/${meeting.id}`}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary-light"
          >
            <Eye size={14} />
            View
          </Link>
          {editable && (
            <>
              <Link
                to={`/meetings/${meeting.id}/edit`}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-bg"
              >
                <SquarePen size={14} />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => onCancelClick(meeting)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger-light"
              >
                <Ban size={14} />
                Cancel
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
