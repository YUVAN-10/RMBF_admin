// Shaped to match the Firestore structure:
//   powerTeamMeetings/{meetingId}
//   powerTeamMeetings/{meetingId}/attendance/{userUid}
// Kept as a fully separate collection from meetings/ per the Power Team
// Meetings module spec — see powerTeamMeetingService.js.

export const emptyPowerTeamMeeting = {
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
  attendanceCount: 0,
  memberIds: [],
};
