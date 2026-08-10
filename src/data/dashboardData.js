// Static/dummy data for the RMBF Erode United admin dashboard.
// Shaped to be a drop-in replacement target once Firebase (Firestore) is
// connected — each export below maps to a future collection/query.

export const statsData = {
  totalMembers: {
    value: 125,
    change: "+8 this month",
    trend: "up",
  },
  totalMeetings: {
    value: 24,
    completed: 20,
    upcoming: 4,
  },
  totalRtoR: {
    value: 86,
    monthly: 14,
  },
  totalEvents: {
    value: 12,
    upcoming: 3,
  },
};

// Member growth over the last 6 months
export const memberGrowthData = [
  { month: "Mar", members: 92 },
  { month: "Apr", members: 98 },
  { month: "May", members: 105 },
  { month: "Jun", members: 112 },
  { month: "Jul", members: 118 },
  { month: "Aug", members: 125 },
];

// Activity overview: meetings, R to R, events
export const activityOverviewData = [
  { name: "Meetings", value: 24 },
  { name: "R to R", value: 86 },
  { name: "Events", value: 12 },
];

export const recentMeetings = [
  {
    id: "mtg-1",
    name: "RMBF Weekly Meeting",
    date: "08 Aug 2026",
    time: "10:00 AM",
    place: "Erode",
    attendance: "108/125",
    status: "Completed",
  },
  {
    id: "mtg-2",
    name: "Board Review Meeting",
    date: "05 Aug 2026",
    time: "06:30 PM",
    place: "RMBF Office, Erode",
    attendance: "18/22",
    status: "Completed",
  },
  {
    id: "mtg-3",
    name: "New Members Orientation",
    date: "02 Aug 2026",
    time: "11:00 AM",
    place: "Community Hall, Erode",
    attendance: "14/16",
    status: "Completed",
  },
  {
    id: "mtg-4",
    name: "RMBF Weekly Meeting",
    date: "15 Aug 2026",
    time: "10:00 AM",
    place: "Erode",
    attendance: "-- / 125",
    status: "Upcoming",
  },
  {
    id: "mtg-5",
    name: "Quarterly Business Review",
    date: "22 Aug 2026",
    time: "04:00 PM",
    place: "Erode",
    attendance: "-- / 125",
    status: "Upcoming",
  },
];

export const upcomingEvents = [
  {
    id: "evt-1",
    name: "Business Networking Meet",
    date: "18 Aug 2026",
    time: "05:00 PM",
    image: null,
  },
  {
    id: "evt-2",
    name: "Annual Charity Drive",
    date: "24 Aug 2026",
    time: "09:00 AM",
    image: null,
  },
  {
    id: "evt-3",
    name: "RMBF Founders Day",
    date: "30 Aug 2026",
    time: "06:00 PM",
    image: null,
  },
  {
    id: "evt-4",
    name: "Skill Development Workshop",
    date: "05 Sep 2026",
    time: "10:00 AM",
    image: null,
  },
];

export const recentActivity = [
  {
    id: "act-1",
    type: "thank-note",
    text: "Yuvan sent a Thank Note to Alice",
    time: "2 hours ago",
  },
  {
    id: "act-2",
    type: "meeting",
    text: "Anand attended RMBF Weekly Meeting",
    time: "5 hours ago",
  },
  {
    id: "act-3",
    type: "member",
    text: "New member added: Kumar S",
    time: "1 day ago",
  },
  {
    id: "act-4",
    type: "r2r",
    text: "R to R created by Balaji",
    time: "1 day ago",
  },
  {
    id: "act-5",
    type: "event",
    text: "New event created: Business Networking Meet",
    time: "2 days ago",
  },
];
