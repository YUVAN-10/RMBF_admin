export function isPastEvent(eventDate) {
  if (!eventDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(eventDate) < today;
}

export function getDisplayStatus(event) {
  if (event.status === "Inactive") return "Inactive";
  return isPastEvent(event.eventDate) ? "Completed" : "Upcoming";
}
