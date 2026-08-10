// A meeting's displayed status is computed from its date rather than
// hand-set by the admin — the only manual override is "cancelled".
// This keeps `status` in sync automatically as the meeting date arrives
// and passes, matching how the real QR check-in flow will work later.

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function computeMeetingStatus(meeting) {
  if (meeting.status === "cancelled") return "cancelled";

  const today = startOfDay(new Date());
  const meetingDay = startOfDay(meeting.meetingDate);

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
