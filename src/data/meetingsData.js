// Dummy meeting records for RMBF Erode United.
// Shaped to match the future Firestore structure:
//   meetings/{meetingId}
//   meetings/{meetingId}/attendance/{userUid}
// so this module can be swapped for real Firestore + QR-scan attendance
// later without touching the components that consume it.
//
// Attendance references the real member roster (see membersData.js) via
// userUid rather than inventing separate dummy attendees.

export const initialMeetings = [];

export const emptyMeeting = {
  id: "",
  meetingName: "",
  meetingDate: "",
  meetingTime: "",
  place: "",
  qrToken: "",
  createdBy: "Admin",
  status: "upcoming",
  createdAt: "",
  updatedAt: "",
  attendance: [],
};
