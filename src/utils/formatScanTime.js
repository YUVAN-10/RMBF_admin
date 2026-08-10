// The scanned date and scanned time are deliberately separate display
// values (see Meetings module spec) — both derived from the single
// `scannedAt` server timestamp the backend will eventually write.

export function formatScanDate(scannedAt) {
  if (!scannedAt) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(scannedAt));
}

export function formatScanTime(scannedAt) {
  if (!scannedAt) return "";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(scannedAt));
}
