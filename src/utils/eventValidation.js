export function validateEventForm(data) {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = "Event name is required";
  }
  if (!data.eventDate) {
    errors.eventDate = "Date is required";
  }
  if (!data.eventTime) {
    errors.eventTime = "Time is required";
  }
  if (!data.imageUrl) {
    errors.imageUrl = "Event image is required";
  }

  return errors;
}
