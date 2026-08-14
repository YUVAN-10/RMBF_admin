// Default values for settings/pointsMaster — used to seed the document on
// first read and as a fallback merge so the UI never sees an undefined
// field, even if the stored document predates a newly added key.
//
// NOTE ("Absent" vs "Absent - Alternate"): the source design only supplied
// two numeric values (-500 and -400) with the same "Absent" label and no
// documented distinction. Neither meaning is already defined elsewhere in
// this codebase (no existing Leave/Attendance module exists to infer it
// from), so this keeps them as two clearly separate, independently
// editable settings without inventing a business meaning for either one.
// Confirm with the client what "Absent - Alternate" represents before
// wiring it into a real calculation.
export const DEFAULT_POINTS_MASTER = {
  rToRPoints: 250,
  powerTeamAttendancePoints: 1000,
  absentPoints: -500,
  attendancePresentPoints: 500,
  leavePoints: -300,
  absentAlternatePoints: -400,
  earlyGoingLatePoints: -200,
  referralValuePer1000: 5,
  referralCountPoints: 200,
  visitorsCountPoints: 1500,
  monthlyPointLimit: 10000,
};

export const POINTS_MASTER_FIELDS = [
  { key: "rToRPoints", label: "R to R" },
  { key: "powerTeamAttendancePoints", label: "Power Team Attendance" },
  { key: "absentPoints", label: "Absent" },
  { key: "attendancePresentPoints", label: "Attendance - Present" },
  { key: "leavePoints", label: "Leave" },
  { key: "absentAlternatePoints", label: "Absent - Alternate" },
  { key: "earlyGoingLatePoints", label: "Early Going / Late" },
  { key: "referralValuePer1000", label: "Referral Value for each ₹1000" },
  { key: "referralCountPoints", label: "Referral Count" },
  { key: "visitorsCountPoints", label: "Visitors Count" },
  { key: "monthlyPointLimit", label: "Monthly Point Limit" },
];
