// Static/dummy data for the RMBF Erode United admin dashboard.
// Shaped to be a drop-in replacement target once Firebase (Firestore) is
// connected — each export below maps to a future collection/query.

export const statsData = {
  totalMembers: {
    value: 125,
    change: "+8 this term",
    trend: "up",
  },
  totalMeetings: {
    value: 24,
    completed: 20,
    upcoming: 4,
  },
  totalRtoR: {
    value: 86,
    termly: 14,
  },
  totalEvents: {
    value: 12,
    upcoming: 3,
  },
};
