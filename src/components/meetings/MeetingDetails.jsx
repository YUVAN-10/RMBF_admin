import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, MapPin } from "lucide-react";
import MeetingStatusBadge from "./MeetingStatusBadge";
import MeetingQRCode from "./MeetingQRCode";
import AttendanceOverview from "./AttendanceOverview";
import AttendanceTable from "./AttendanceTable";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { formatScanDate, formatScanTime } from "../../utils/formatScanTime";

export default function MeetingDetails({ meeting, activeMembers }) {
  const attendanceByUid = new Map(meeting.attendance.map((record) => [record.userUid, record]));

  const meetingDateTime = new Date(`${meeting.meetingDate}T${meeting.meetingTime}`);

  const rows = activeMembers.map((member) => {
    const record = attendanceByUid.get(member.uid);
    let status = "Absent";

    if (record) {
      const scannedDateTime = new Date(record.scannedAt);
      const diffMs = scannedDateTime - meetingDateTime;
      const diffMins = diffMs / (1000 * 60);

      if (diffMins <= 15) {
        status = "Present";
      } else if (diffMins <= 30) {
        status = "Permission";
      } else {
        status = "Absent";
      }
    }

    return {
      uid: member.uid,
      name: member.fullName,
      ridNo: member.ridNo,
      phone: member.phone,
      status,
      scannedDate: record ? formatScanDate(record.scannedAt) : null,
      scannedTime: record ? formatScanTime(record.scannedAt) : null,
    };
  });

  const total = activeMembers.length;
  const present = rows.filter((r) => r.status === "Present").length;
  const permission = rows.filter((r) => r.status === "Permission").length;
  const absent = Math.max(0, total - present - permission);
  const rate = total === 0 ? 0 : Math.round(((present + permission) / total) * 1000) / 10;

  return (
    <div className="space-y-6">
      <Link
        to="/meetings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Meetings
      </Link>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text">{meeting.meetingName}</h1>
            <p className="mt-1 text-xs text-text-secondary">Created {formatDate(meeting.createdAt)}</p>
          </div>
          <MeetingStatusBadge meeting={meeting} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm text-text">
            <CalendarDays size={16} className="text-primary" />
            {formatDate(meeting.meetingDate)}
          </div>
          <div className="flex items-center gap-2 text-sm text-text">
            <Clock size={16} className="text-primary" />
            {formatTime(meeting.meetingTime)}
          </div>
          {meeting.place && (
            <div className="flex items-center gap-2 text-sm text-text">
              <MapPin size={16} className="text-primary" />
              {meeting.place}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MeetingQRCode meeting={meeting} />
        <AttendanceOverview total={total} present={present} permission={permission} absent={absent} rate={rate} />
      </div>

      <AttendanceTable rows={rows} />
    </div>
  );
}
