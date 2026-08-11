import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { createEvent, updateEvent } from "../services/eventService";
import { MAX_ACTIVE_EVENTS } from "../data/eventsData";

function getRawDate(val) {
  if (!val) return new Date(0);
  if (typeof val.toDate === "function") return val.toDate();
  if (typeof val.seconds === "number") return new Date(val.seconds * 1000);
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
}

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

function normalizeEvent(docId, data) {
  const name =
    getFieldValue(data, "Event Name", "EventName", "eventName", "name", "title", "heading") ||
    "Untitled Event";

  const eventDate =
    getFieldValue(data, "Date", "date", "eventDate", "event_date", "startDate", "dateTime", "createdAt") ||
    "";

  const eventTime =
    getFieldValue(data, "time", "Time", "eventTime", "event_time", "startTime") ||
    "";

  const location =
    getFieldValue(data, "Location", "location", "venue", "place", "eventLocation") ||
    "";

  const description =
    getFieldValue(data, "Description", "description", "desc", "details", "summary") ||
    "";

  const imageUrl =
    getFieldValue(data, "eventImage", "imageUrl", "image", "img", "photoUrl") ||
    null;

  const status = getFieldValue(data, "status", "Status") || "Active";
  const createdAt = getFieldValue(data, "createdAt", "created_at", "Date") || new Date();

  return {
    ...data,
    id: docId,
    name,
    eventDate,
    eventTime,
    location,
    description,
    imageUrl,
    status,
    createdAt,
  };
}

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventsRef = collection(db, "events");

    const unsubscribe = onSnapshot(
      eventsRef,
      (snapshot) => {
        const eventsData = [];
        snapshot.forEach((docSnap) => {
          eventsData.push(normalizeEvent(docSnap.id, docSnap.data()));
        });

        // In-memory sort by eventDate / createdAt descending
        eventsData.sort((a, b) => {
          const dateA = getRawDate(a.eventDate || a.createdAt);
          const dateB = getRawDate(b.eventDate || b.createdAt);
          return dateB - dateA;
        });

        setEvents(eventsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const activeCount = useMemo(() => events.filter((e) => e.status === "Active").length, [events]);

  const value = useMemo(
    () => ({
      events,
      activeCount,
      loading,
      maxActiveEvents: MAX_ACTIVE_EVENTS,
      getEventById: (id) => events.find((e) => e.id === id) ?? null,
      addEvent: async (data, imageFile) => {
        return await createEvent(data, imageFile);
      },
      updateEvent: async (id, data, imageFile) => {
        await updateEvent(id, data, imageFile);
      },
      activateEvent: async (id) => {
        if (activeCount >= MAX_ACTIVE_EVENTS) return;
        const event = events.find((e) => e.id === id);
        if (event) {
          await updateEvent(id, { ...event, status: "Active" }, null);
        }
      },
    }),
    [events, activeCount, loading]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return ctx;
}
