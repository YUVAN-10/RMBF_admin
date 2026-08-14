import { getMeetingDateObj } from "./meetingStatus";

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isMeetingToday(meeting) {
  const day = startOfDay(getMeetingDateObj(meeting));
  return day.getTime() === startOfDay(new Date()).getTime();
}

export function isMeetingThisWeek(meeting) {
  const day = startOfDay(getMeetingDateObj(meeting));
  const now = new Date();
  const startOfWeek = startOfDay(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return day >= startOfWeek && day < endOfWeek;
}

export function isMeetingThisMonth(meeting) {
  const day = getMeetingDateObj(meeting);
  const now = new Date();
  return day.getFullYear() === now.getFullYear() && day.getMonth() === now.getMonth();
}
