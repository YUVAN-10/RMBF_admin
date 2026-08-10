import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { createEvent, updateEvent } from "../services/eventService";
import { MAX_ACTIVE_EVENTS } from "../data/eventsData";

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventsData = [];
        snapshot.forEach((doc) => {
          eventsData.push({ id: doc.id, ...doc.data() });
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
