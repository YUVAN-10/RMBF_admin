// Dummy event records for RMBF Erode United.
// Shaped to match the future Firestore collection: events/{eventId}
// so this module can be swapped for a Firestore query later without
// touching the components that consume it.

export const MAX_ACTIVE_EVENTS = 5;

export const initialEvents = [];

export const emptyEvent = {
  id: "",
  name: "",
  description: "",
  eventDate: "",
  eventTime: "",
  location: "",
  imageUrl: null,
  createdBy: "Admin",
  status: "Active",
  createdAt: "",
  updatedAt: "",
};
