import { createContext, useContext, useMemo, useState } from "react";
import { initialMeetings } from "../data/meetingsData";
import { computeMeetingStatus } from "../utils/meetingStatus";
import { generateMeetingId, generateQrToken } from "../utils/qrToken";

// Frontend-only meeting store. Each method here is a placeholder for a
// future Firestore call (meetings/{meetingId}) — addMeeting -> setDoc,
// updateMeeting/cancelMeeting -> updateDoc, getMeetingById -> getDoc.
// Attendance (meetings/{meetingId}/attendance/{userUid}) will later be
// written by the user app's QR-scan flow, using a Firebase server
// timestamp for scannedAt — never the device's local clock.
// Intentionally no deleteMeeting method exists in this module.

const MeetingsContext = createContext(null);

export function MeetingsProvider({ children }) {
  const [meetings, setMeetings] = useState(initialMeetings);

  const value = useMemo(
    () => ({
      meetings,
      getMeetingById: (id) => meetings.find((m) => m.id === id) ?? null,
      addMeeting: (data) => {
        const now = new Date().toISOString();
        const newMeeting = {
          ...data,
          id: generateMeetingId(),
          qrToken: generateQrToken(),
          createdBy: "Admin",
          attendance: [],
          createdAt: now,
          updatedAt: now,
        };
        newMeeting.status = computeMeetingStatus(newMeeting);
        setMeetings((prev) => [newMeeting, ...prev]);
        return newMeeting;
      },
      updateMeeting: (id, data) => {
        const now = new Date().toISOString();
        setMeetings((prev) =>
          prev.map((meeting) => {
            if (meeting.id !== id) return meeting;
            const updated = { ...meeting, ...data, updatedAt: now };
            updated.status = computeMeetingStatus(updated);
            return updated;
          })
        );
      },
      cancelMeeting: (id) => {
        const now = new Date().toISOString();
        setMeetings((prev) =>
          prev.map((meeting) =>
            meeting.id === id ? { ...meeting, status: "cancelled", updatedAt: now } : meeting
          )
        );
      },
    }),
    [meetings]
  );

  return <MeetingsContext.Provider value={value}>{children}</MeetingsContext.Provider>;
}

export function useMeetings() {
  const ctx = useContext(MeetingsContext);
  if (!ctx) {
    throw new Error("useMeetings must be used within a MeetingsProvider");
  }
  return ctx;
}
