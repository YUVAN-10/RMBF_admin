import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import MeetingStatusBadge from "./MeetingStatusBadge";
import MeetingQRCode from "./MeetingQRCode";
import AttendanceOverview from "./AttendanceOverview";
import AttendanceTable from "./AttendanceTable";
import MemberMiniProfile from "../rtor/MemberMiniProfile";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { formatScanDate, formatScanTime } from "../../utils/formatScanTime";
import { buildPowerTeamQrPayload } from "../../utils/qrToken";
import { subscribeToPowerTeamMeetingAttendance } from "../../services/powerTeamMeetingService";

export default function PowerTeamMeetingDetails({ meeting, activeMembers }) {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToPowerTeamMeetingAttendance(meeting.id, setAttendance);
    return () => unsubscribe();
  }, [meeting.id]);

  const attendanceByUid = new Map(attendance.map((record) => [record.userUid, record]));

  // eligibleMemberIds (the frozen Power Team roster snapshot taken when the
  // meeting was created) is authoritative; memberIds/all-active-members are
  // only a fallback for meetings created before this field existed.
  const eligibleIds = meeting.eligibleMemberIds ?? meeting.memberIds ?? [];
  const trackedMembers =
    eligibleIds.length > 0 ? activeMembers.filter((member) => eligibleIds.includes(member.uid)) : activeMembers;

  // Power Team attendance is binary — a scan either exists (Present) or it
  // doesn't (Absent); there is no "Permission" grace window like Meetings.
  const rows = trackedMembers.map((member) => {
    const record = attendanceByUid.get(member.uid);

    return {
      uid: member.uid,
      name: member.fullName,
      ridNo: member.ridNo,
      phone: member.phone,
      status: record ? "Present" : "Absent",
      scannedDate: record ? formatScanDate(record.scannedAt) : null,
      scannedTime: record ? formatScanTime(record.scannedAt) : null,
    };
  });

  const total = trackedMembers.length;
  const present = rows.filter((r) => r.status === "Present").length;
  const absent = Math.max(0, total - present);
  const rate = total === 0 ? 0 : Math.round((present / total) * 1000) / 10;

  const hasInviteList = eligibleIds.length > 0;

  return (
    <div className="space-y-6">
      <Link
        to="/power-team-meetings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Power Team Meetings
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
          {meeting.powerTeamName && (
            <div className="flex items-center gap-2 text-sm text-text">
              <Users size={16} className="text-primary" />
              Power Team: {meeting.powerTeamName}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-text">
            <Users size={16} className="text-primary" />
            Attendance: {present} / {total}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
        <div className="mb-4 flex items-center gap-2">
          <Users size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-secondary">Power Team Members</h2>
          <span className="text-xs text-text-secondary">
            {hasInviteList ? `(${trackedMembers.length})` : "(All active members)"}
          </span>
        </div>

        {hasInviteList ? (
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {trackedMembers.map((member) => (
              <MemberMiniProfile
                key={member.uid}
                name={member.fullName}
                ridNo={member.ridNo}
                image={member.profileImage}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">
            No specific members were invited — every active member is tracked for attendance.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MeetingQRCode meeting={meeting} payload={buildPowerTeamQrPayload(meeting)} />
        <AttendanceOverview total={total} present={present} permission={0} absent={absent} rate={rate} />
      </div>

      <AttendanceTable rows={rows} title={meeting.meetingName} />
    </div>
  );
}
