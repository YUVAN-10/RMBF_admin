import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, doc, collection as firestoreCollection } from "firebase/firestore";
import { db } from "../firebase/config";
import { createMeeting, updateMeeting, cancelMeeting } from "../services/meetingService";
import { computeMeetingStatus } from "../utils/meetingStatus";

function getFieldValue(data, ...keys) {
  if (!data) return undefined;
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      return data[key];
    }
  }
  const dataKeys = Object.keys(data);
  for (const key of keys) {
    const cleanKey = key.toLowerCase().replace(/[\s_-]/g, "");
    const matchedKey = dataKeys.find(
      (k) => k.toLowerCase().replace(/[\s_-]/g, "") === cleanKey
    );
    if (matchedKey && data[matchedKey] !== undefined && data[matchedKey] !== null && data[matchedKey] !== "") {
      return data[matchedKey];
    }
  }
  return undefined;
}

export function normalizeMeeting(docId, data) {
  if (!data) return { id: docId };

  const title = getFieldValue(data, "title", "meetingName", "name", "meetingTitle") || "RMBF Meeting";
  const dateVal = getFieldValue(data, "date", "meetingDate", "createdAt") || new Date();
  const timeVal = getFieldValue(data, "time", "scannedTime", "meetingTime", "startTime") || "";
  const location = getFieldValue(data, "location", "place", "venue") || "";
  const description = getFieldValue(data, "description", "desc", "details") || "";
  const qrCodeData = getFieldValue(data, "qrCodeData", "qrCode") || docId;

  // Process attendance map or array
  let attendance = [];
  const rawAttendance = data.attendance;
  if (rawAttendance) {
    if (Array.isArray(rawAttendance)) {
      attendance = rawAttendance.map((rec) => ({
        ...rec,
        memberUid: rec.memberUid || rec.userUid || rec.uid || "",
        userUid: rec.userUid || rec.memberUid || rec.uid || "",
        scannedAt: rec.scannedAt || rec.scannedDate || rec.createdAt || new Date(),
        scannedDate: rec.scannedDate || rec.scannedAt || new Date(),
        scannedTime: rec.scannedTime || "",
        status: rec.status || "present",
      }));
    } else if (typeof rawAttendance === "object") {
      attendance = Object.entries(rawAttendance).map(([key, val]) => {
        if (typeof val === "object" && val !== null) {
          return {
            ...val,
            memberUid: val.memberUid || val.userUid || val.uid || key,
            userUid: val.userUid || val.memberUid || val.uid || key,
            scannedAt: val.scannedAt || val.scannedDate || new Date(),
            scannedDate: val.scannedDate || val.scannedAt || new Date(),
            scannedTime: val.scannedTime || "",
            status: val.status || "present",
          };
        }
        return {
          memberUid: key,
          userUid: key,
          scannedAt: new Date(),
          scannedDate: new Date(),
          scannedTime: "",
          status: String(val || "present"),
        };
      });
    }
  }

  const normalized = {
    ...data,
    id: docId,
    title,
    meetingName: title,
    name: title,
    date: dateVal,
    meetingDate: dateVal,
    time: timeVal,
    meetingTime: timeVal,
    scannedTime: timeVal,
    location,
    place: location,
    venue: location,
    description,
    qrCodeData,
    attendance,
  };

  normalized.status = computeMeetingStatus(normalized);
  return normalized;
}

const MeetingsContext = createContext(null);

export function MeetingsProvider({ children }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const meetingsRef = collection(db, "meetings");

    const unsubscribe = onSnapshot(
      meetingsRef,
      (snapshot) => {
        const meetingsData = [];
        snapshot.forEach((docSnap) => {
          meetingsData.push(normalizeMeeting(docSnap.id, docSnap.data()));
        });

        // In-memory sort by date descending
        meetingsData.sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB - dateA;
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
