// Dummy R to R records for RMBF Erode United.
// Shaped to match the future Firestore collection: rToR/{rToRId}
// R to R records are created by members from the User App — the Admin
// Panel is read-only here, so this module has no add/update/delete.
//
// fromUserId/toUserId reference the real member roster (membersData.js)
// rather than inventing separate dummy people, matching the "use the
// existing members collection to identify members" requirement.

export const initialRToR = [];
