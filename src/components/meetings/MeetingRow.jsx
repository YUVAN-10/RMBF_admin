import { Link } from "react-router-dom";
import { Eye, SquarePen, Ban } from "lucide-react";
import MeetingStatusBadge from "./MeetingStatusBadge";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { isMeetingEditable } from "../../utils/meetingStatus";

export default function MeetingRow({
  meeting,
  serialNo,
  totalActiveMembers,
  onCancelClick,
  basePath = "/meetings",
  showInvitedColumn = false,
  members = [],
}) {
  const editable = isMeetingEditable(meeting);
  const present = meeting.attendanceCount ?? meeting.attendance?.length ?? 0;
  // eligibleMemberIds (a frozen snapshot of the meeting's Power Team roster)
  // takes priority over memberIds/totalActiveMembers — only Power Team
  // Meeting docs ever have it, so plain Meetings are unaffected.
  const attendanceTotal = meeting.eligibleMemberIds
    ? meeting.eligibleMemberIds.length
    : meeting.memberIds?.length || totalActiveMembers;

  const invitedNames = (meeting.eligibleMemberIds || meeting.memberIds || [])
    .map((uid) => members.find((m) => m.uid === uid)?.fullName)
    .filter(Boolean);
  const invitedLabel =
    invitedNames.length > 2
      ? `${invitedNames.slice(0, 2).join(", ")} +${invitedNames.length - 2} more`
      : invitedNames.join(", ");

  return (
    <tr className="border-b border-border transition-colors last:border-0 hover:bg-bg">
      <td className="px-4 py-3 text-text-secondary">{serialNo}</td>
      <td className="px-4 py-3 font-medium text-text">{meeting.meetingName}</td>
      <td className="px-4 py-3 text-text-secondary">{formatDate(meeting.meetingDate)}</td>
      <td className="px-4 py-3 text-text-secondary">{formatTime(meeting.meetingTime)}</td>
      <td className="px-4 py-3 text-text-secondary">{meeting.place}</td>
      {showInvitedColumn && (
        <td className="max-w-[220px] px-4 py-3 text-text-secondary">
          {invitedNames.length > 0 ? (
            <span title={invitedNames.join(", ")}>{invitedLabel}</span>
          ) : (
            "All active members"
          )}
        </td>
      )}
      <td className="px-4 py-3 tabular-nums text-text-secondary">
        {present} / {attendanceTotal}
      </td>
      <td className="px-4 py-3">
        <MeetingStatusBadge meeting={meeting} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Link
            to={`${basePath}/${meeting.id}`}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary-light"
          >
            <Eye size={14} />
            View
          </Link>
          {editable && (
            <>
              <Link
                to={`${basePath}/${meeting.id}/edit`}
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
