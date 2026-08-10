// R to R timestamps are stored as a single `createdAt` ISO string (the
// eventual Firebase server timestamp) — these helpers derive the separate
// date/time display values the UI needs from that one source of truth.

export function formatRecordDate(iso) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function formatRecordDateLong(iso) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function formatRecordTime(iso) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function formatRecordDateTime(iso) {
  if (!iso) return "";
  return `${formatRecordDateLong(iso)}, ${formatRecordTime(iso)}`;
}
