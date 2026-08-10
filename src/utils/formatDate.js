export function formatDate(value) {
  if (!value) return "";
  
  // Handle Firestore Timestamp
  let dateObj = value;
  if (value && typeof value.toDate === 'function') {
    dateObj = value.toDate();
  }

  const date = new Date(dateObj);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'object' ? "Invalid Date" : value;
  }
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
