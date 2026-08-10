// Dummy meeting records for RMBF Erode United.
// Shaped to match the future Firestore structure:
//   meetings/{meetingId}
//   meetings/{meetingId}/attendance/{userUid}
// so this module can be swapped for real Firestore + QR-scan attendance
// later without touching the components that consume it.
//
// Attendance references the real member roster (see membersData.js) via
// userUid rather than inventing separate dummy attendees.

export const initialMeetings = [
  {
    id: "meet-001",
    meetingName: "RMBF Weekly Meeting",
    meetingDate: "2026-08-15",
    meetingTime: "10:00",
    place: "RMBF Hall, Erode",
    qrToken: "qrt_7f3ka9m2x1",
    createdBy: "Yuvan Kumar",
    status: "upcoming",
    createdAt: "2026-08-01T09:00:00.000Z",
    updatedAt: "2026-08-01T09:00:00.000Z",
    // No one has scanned in yet — the meeting hasn't happened.
    attendance: [],
  },
  {
    id: "meet-002",
    meetingName: "Monthly Business Meeting",
    meetingDate: "2026-08-08",
    meetingTime: "10:00",
    place: "Erode",
    qrToken: "qrt_2b8pw5j0q4",
    createdBy: "Anand Raj",
    status: "completed",
    createdAt: "2026-07-25T09:00:00.000Z",
    updatedAt: "2026-08-08T11:00:00.000Z",
    attendance: [
      {
        userUid: "mem-001",
        memberId: "mem-001",
        memberName: "Yuvan Kumar",
        ridNo: "RMBF001",
        meetingDate: "2026-08-08",
        scannedAt: "2026-08-08T10:07:32.000Z",
        status: "Present",
      },
      {
        userUid: "mem-002",
        memberId: "mem-002",
        memberName: "Anand Raj",
        ridNo: "RMBF002",
        meetingDate: "2026-08-08",
        scannedAt: "2026-08-08T10:09:15.000Z",
        status: "Present",
      },
      {
        userUid: "mem-003",
        memberId: "mem-003",
        memberName: "Balaji M",
        ridNo: "RMBF003",
        meetingDate: "2026-08-08",
        scannedAt: "2026-08-08T10:11:04.000Z",
        status: "Present",
      },
      {
        userUid: "mem-005",
        memberId: "mem-005",
        memberName: "Priya Dharshini",
        ridNo: "RMBF005",
        meetingDate: "2026-08-08",
        scannedAt: "2026-08-08T10:14:47.000Z",
        status: "Present",
      },
      {
        userUid: "mem-009",
        memberId: "mem-009",
        memberName: "Meena Devi",
        ridNo: "RMBF009",
        meetingDate: "2026-08-08",
        scannedAt: "2026-08-08T10:18:22.000Z",
        status: "Present",
      },
    ],
  },
];

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
