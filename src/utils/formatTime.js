export function formatTime(value) {
  if (!value) return "";

  if (typeof value === "string") {
    if (value.includes("AM") || value.includes("PM") || value.includes("am") || value.includes("pm")) {
      return value;
    }
    const parts = value.split(":");
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
      }
    }
    return value;
  }

  let dateObj = value;
  if (value && typeof value.toDate === "function") {
    dateObj = value.toDate();
  } else if (value && typeof value.seconds === "number") {
    dateObj = new Date(value.seconds * 1000);
  }

  const date = new Date(dateObj);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  return "";
}
