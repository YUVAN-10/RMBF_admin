// Every member is capped at this many points per calendar month — see
// pointsService.js for how awardPoints() enforces it atomically.
export const MONTHLY_POINT_LIMIT = 10000;

function pad(n) {
  return String(n).padStart(2, "0");
}

/** The current calendar month as a "YYYY-MM" id, used as the monthly doc ID. */
export function getCurrentMonthId() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
}

/** "2026-08" -> "August 2026" */
export function formatMonthLabel(monthId) {
  if (!monthId) return "";
  const [year, month] = monthId.split("-").map(Number);
  if (!year || !month) return monthId;
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(date);
}

/** Points progress as a whole-number percent, never exceeding 100. */
export function pointsPercent(points, maxPoints = MONTHLY_POINT_LIMIT) {
  if (!maxPoints) return 0;
  return Math.min(100, Math.round((Math.max(0, points) / maxPoints) * 100));
}
