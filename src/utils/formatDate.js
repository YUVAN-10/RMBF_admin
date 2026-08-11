export function formatDate(value) {
  if (!value) return "";
  
  let dateObj = value;
  if (value && typeof value.toDate === 'function') {
    dateObj = value.toDate();
  } else if (value && typeof value.seconds === 'number') {
    dateObj = new Date(value.seconds * 1000);
  } else if (typeof value === 'string' || typeof value === 'number') {
    dateObj = new Date(value);
  }

  const date = new Date(dateObj);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : "";
  }
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
