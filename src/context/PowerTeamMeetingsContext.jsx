import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  createPowerTeamMeeting,
  updatePowerTeamMeeting,
  cancelPowerTeamMeeting,
} from "../services/powerTeamMeetingService";
import { computeMeetingStatus } from "../utils/meetingStatus";

export function normalizePowerTeamMeeting(docId, data) {
  if (!data) return { id: docId };

  const normalized = {
    ...data,
    id: docId,
    meetingName: data.meetingName || "Power Team Meeting",
    powerTeamId: data.powerTeamId || "",
    powerTeamName: data.powerTeamName || "",
    termId: typeof data.termId === "number" ? data.termId : null,
    meetingDate: data.meetingDate || "",
    meetingTime: data.meetingTime || "",
    place: data.place || "",
    // attendanceCount is a denormalized counter maintained transactionally
    // alongside each attendance doc — see powerTeamMeetingService.js.
    attendanceCount: typeof data.attendanceCount === "number" ? data.attendanceCount : 0,
    memberIds: Array.isArray(data.memberIds) ? data.memberIds : [],
    // Left undefined (not defaulted to []) when absent so downstream code
    // can tell "legacy meeting, no snapshot" apart from "0 eligible".
    eligibleMemberIds: Array.isArray(data.eligibleMemberIds) ? data.eligibleMemberIds : undefined,
    eligibleMemberCount: typeof data.eligibleMemberCount === "number" ? data.eligibleMemberCount : undefined,
  };

  normalized.status = computeMeetingStatus(normalized);
  return normalized;
}

const PowerTeamMeetingsContext = createContext(null);

export function PowerTeamMeetingsProvider({ children }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const meetingsRef = collection(db, "powerTeamMeetings");

    const unsubscribe = onSnapshot(
      meetingsRef,
      (snapshot) => {
        const meetingsData = [];
        snapshot.forEach((docSnap) => {
          meetingsData.push(normalizePowerTeamMeeting(docSnap.id, docSnap.data()));
        });

        // In-memory sort by date descending
        meetingsData.sort((a, b) => new Date(b.meetingDate) - new Date(a.meetingDate));

        setMeetings(meetingsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching power team meetings:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      meetings,
      loading,
      getMeetingById: (id) => meetings.find((m) => m.id === id) ?? null,
      addMeeting: async (data) => {
        return await createPowerTeamMeeting(data);
      },
      updateMeeting: async (id, data) => {
        await updatePowerTeamMeeting(id, data);
      },
      cancelMeeting: async (id) => {
        await cancelPowerTeamMeeting(id);
      },
    }),
    [meetings, loading]
  );

  return <PowerTeamMeetingsContext.Provider value={value}>{children}</PowerTeamMeetingsContext.Provider>;
}

export function usePowerTeamMeetings() {
  const ctx = useContext(PowerTeamMeetingsContext);
  if (!ctx) {
    throw new Error("usePowerTeamMeetings must be used within a PowerTeamMeetingsProvider");
  }
  return ctx;
}
