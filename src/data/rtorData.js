// Dummy R to R records for RMBF Erode United.
// Shaped to match the future Firestore collection: rToR/{rToRId}
// R to R records are created by members from the User App — the Admin
// Panel is read-only here, so this module has no add/update/delete.
//
// fromUserId/toUserId reference the real member roster (membersData.js)
// rather than inventing separate dummy people, matching the "use the
// existing members collection to identify members" requirement.

export const initialRToR = [
  {
    id: "r2r-001",
    fromUserId: "mem-001",
    fromName: "Yuvan Kumar",
    toUserId: "mem-005",
    toName: "Priya Dharshini",
    createdAt: "2026-08-10T05:05:00.000Z",
    message: "Connected for a textile supply lead.",
  },
  {
    id: "r2r-002",
    fromUserId: "mem-002",
    fromName: "Anand Raj",
    toUserId: "mem-008",
    toName: "Karthik S",
    createdAt: "2026-08-10T02:15:00.000Z",
    message: "",
  },
  {
    id: "r2r-003",
    fromUserId: "mem-003",
    fromName: "Balaji M",
    toUserId: "mem-009",
    toName: "Meena Devi",
    createdAt: "2026-08-09T10:50:00.000Z",
    message: "Referred a turmeric trading opportunity.",
  },
  {
    id: "r2r-004",
    fromUserId: "mem-004",
    fromName: "Kumar S",
    toUserId: "mem-001",
    toName: "Yuvan Kumar",
    createdAt: "2026-08-09T04:10:00.000Z",
    message: "",
  },
  {
    id: "r2r-005",
    fromUserId: "mem-005",
    fromName: "Priya Dharshini",
    toUserId: "mem-007",
    toName: "Vignesh R",
    createdAt: "2026-08-08T09:20:00.000Z",
    message: "Introduced for a fabric sourcing deal.",
  },
  {
    id: "r2r-006",
    fromUserId: "mem-006",
    fromName: "Senthil Kumar",
    toUserId: "mem-003",
    toName: "Balaji M",
    createdAt: "2026-08-07T06:45:00.000Z",
    message: "",
  },
  {
    id: "r2r-007",
    fromUserId: "mem-007",
    fromName: "Vignesh R",
    toUserId: "mem-010",
    toName: "Suresh Babu",
    createdAt: "2026-08-05T11:00:00.000Z",
    message: "",
  },
  {
    id: "r2r-008",
    fromUserId: "mem-009",
    fromName: "Meena Devi",
    toUserId: "mem-002",
    toName: "Anand Raj",
    createdAt: "2026-08-03T07:30:00.000Z",
    message: "Passed on a wholesale provisions contact.",
  },
  {
    id: "r2r-009",
    fromUserId: "mem-010",
    fromName: "Suresh Babu",
    toUserId: "mem-004",
    toName: "Kumar S",
    createdAt: "2026-07-29T08:15:00.000Z",
    message: "",
  },
  {
    id: "r2r-010",
    fromUserId: "mem-008",
    fromName: "Karthik S",
    toUserId: "mem-006",
    toName: "Senthil Kumar",
    createdAt: "2026-07-22T12:00:00.000Z",
    message: "",
  },
];
