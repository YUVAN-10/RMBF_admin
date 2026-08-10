// The scanned date and scanned time are deliberately separate display
// values (see Meetings module spec) — both derived from the single
// `scannedAt` server timestamp the backend will eventually write.

export function formatScanDate(scannedAt) {
  if (!scannedAt) return "";
  let dateObj = scannedAt;
  if (scannedAt && typeof scannedAt.toDate === 'function') {
    dateObj = scannedAt.toDate();
  }
  const date = new Date(dateObj);
  if (Number.isNaN(date.getTime())) return "Invalid Date";
  
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatScanTime(scannedAt) {
  if (!scannedAt) return "";
  let dateObj = scannedAt;
  if (scannedAt && typeof scannedAt.toDate === 'function') {
    dateObj = scannedAt.toDate();
  }
  const date = new Date(dateObj);
  if (Number.isNaN(date.getTime())) return "Invalid Time";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(date);
}
