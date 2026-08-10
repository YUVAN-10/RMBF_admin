import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, doc, collection as firestoreCollection } from "firebase/firestore";
import { db } from "../firebase/config";
import { createMeeting, updateMeeting, cancelMeeting } from "../services/meetingService";
import { computeMeetingStatus } from "../utils/meetingStatus";

const MeetingsContext = createContext(null);

export function MeetingsProvider({ children }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "meetings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const meetingsData = [];
        // Note: For attendance, we ideally fetch the subcollection, but to keep the 
        // frontend exactly as before, we could also just let components query it separately.
        // For simplicity in keeping the UI working perfectly, if attendance isn't nested directly, 
        // the UI might need to adapt or we query attendance inside a separate listener.
        // For now, we set the meeting document data and default attendance array.
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // compute status locally in case it changed over time since last update
          data.status = computeMeetingStatus(data); 
          const attendance = Array.isArray(data.attendance) ? data.attendance : [];
          meetingsData.push({ id: docSnap.id, ...data, attendance });
        });
        setMeetings(meetingsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching meetings:", error);
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
        return await createMeeting(data);
      },
      updateMeeting: async (id, data) => {
        await updateMeeting(id, data);
      },
      cancelMeeting: async (id) => {
        await cancelMeeting(id);
      },
    }),
    [meetings, loading]
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
