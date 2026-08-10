// Dummy secure-token generation for the frontend prototype. Later this
// becomes a Firestore-generated meeting doc ID plus a server-issued
// random token, but the shape callers rely on stays the same.

function randomSegment(length = 10) {
  return Math.random().toString(36).slice(2, 2 + length);
}

export function generateMeetingId() {
  return `meet-${Date.now()}`;
}

export function generateQrToken() {
  return `qrt_${randomSegment()}`;
}

// The QR payload intentionally carries only meeting-identification data —
// never member, phone, or admin information.
export function buildQrPayload(meeting) {
  return JSON.stringify({ meetingId: meeting.id, token: meeting.qrToken });
}
