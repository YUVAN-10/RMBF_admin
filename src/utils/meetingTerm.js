// Same Jan-Jun / Jul-Dec term split already used for R to R stats
// (see RToRPage.jsx) — kept here so meeting-creation limits use the exact
// same definition of "term" as the rest of the app.

// Regular Meetings' cap is fixed, not admin-editable — Power Team Meetings'
// cap lives in settings/meetingLimits and can be changed from the Settings
// page (see meetingLimitsService.js).
export const REGULAR_MEETINGS_PER_TERM = 24;
export const DEFAULT_POWER_TEAM_MEETINGS_PER_TERM = 6;

// Thrown when a create would exceed a term's meeting limit — kept separate
// from generic Firebase errors so the Form pages can show its message
// as-is instead of a raw error code.
export class MeetingLimitError extends Error {}

function toDate(value) {
  if (!value) return new Date();
  if (typeof value.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

/** Which term (and term+year bucket) a meeting date falls into. */
export function getTermForDate(value) {
  const date = toDate(value);
  const year = date.getFullYear();
  const term = date.getMonth() <= 5 ? 1 : 2;
  const key = `${year}-T${term}`;
  const label = term === 1 ? `Term 1 (Jan - Jun ${year})` : `Term 2 (Jul - Dec ${year})`;
  return { year, term, key, label };
}
