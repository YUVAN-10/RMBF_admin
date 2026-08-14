import { MONTHLY_POINT_LIMIT } from "./pointsMonth";

// Fixed, non-overlapping, gap-free bands across the 0-10,000 monthly range.
export const POINT_CATEGORIES = [
  { key: "gray", label: "Gray", min: 0, max: 999, badgeClass: "bg-slate-100 text-slate-600" },
  { key: "red", label: "Red", min: 1000, max: 2999, badgeClass: "bg-red-50 text-red-600" },
  { key: "orange", label: "Orange", min: 3000, max: 5999, badgeClass: "bg-orange-50 text-orange-600" },
  { key: "green", label: "Green", min: 6000, max: MONTHLY_POINT_LIMIT, badgeClass: "bg-green-50 text-green-600" },
];

/**
 * Points above the monthly max can't happen in practice (awardPoints caps at
 * maxPoints) but are excluded here defensively rather than miscounted into
 * one of the four real bands.
 */
export function getPointCategory(points) {
  if (points > MONTHLY_POINT_LIMIT) return "invalid";
  if (points < 1000) return "gray";
  if (points < 3000) return "red";
  if (points < 6000) return "orange";
  return "green";
}

export function formatPointRange(category) {
  return `${category.min.toLocaleString()} - ${category.max.toLocaleString()} Points`;
}
