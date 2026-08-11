// A meeting's displayed status is computed from its date rather than
// hand-set by the admin — the only manual override is "cancelled".
// This keeps `status` in sync automatically as the meeting date arrives
// and passes, matching how the real QR check-in flow will work later.

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getMeetingDateObj(meeting) {
  if (!meeting) return new Date();
  const val = meeting.meetingDate || meeting.date || meeting.createdAt;
  if (!val) return new Date();
  if (typeof val.toDate === "function") return val.toDate();
  if (typeof val.seconds === "number") return new Date(val.seconds * 1000);
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export function computeMeetingStatus(meeting) {
  if (!meeting) return "upcoming";
  if (meeting.status === "cancelled" || meeting.status === "Cancelled") return "cancelled";

  const today = startOfDay(new Date());
  const meetingDay = startOfDay(getMeetingDateObj(meeting));

  if (meetingDay.getTime() === today.getTime()) return "ongoing";
  if (meetingDay.getTime() > today.getTime()) return "upcoming";
  return "completed";
}

export function isMeetingEditable(meeting) {
  return computeMeetingStatus(meeting) === "upcoming";
}

export const statusLabels = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};
