export function validateMeetingForm(data) {
  const errors = {};

  if (!data.meetingName || !data.meetingName.trim()) {
    errors.meetingName = "Meeting name is required";
  }
  if (!data.meetingDate) {
    errors.meetingDate = "Date is required";
  }
  if (!data.meetingTime) {
    errors.meetingTime = "Time is required";
  }
  if (!data.place || !data.place.trim()) {
    errors.place = "Place is required";
  }

  return errors;
}
