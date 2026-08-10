import { createContext, useContext, useMemo, useState } from "react";
import { initialEvents, MAX_ACTIVE_EVENTS } from "../data/eventsData";

// Frontend-only event store. Each method here is a placeholder for a
// future Firestore call (events/{eventId}) — addEvent -> setDoc,
// updateEvent/activateEvent -> updateDoc, getEventById -> getDoc/onSnapshot.
// Intentionally no deleteEvent method exists in this module.

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState(initialEvents);

  const activeCount = useMemo(() => events.filter((e) => e.status === "Active").length, [events]);

  const value = useMemo(
    () => ({
      events,
      activeCount,
      maxActiveEvents: MAX_ACTIVE_EVENTS,
      getEventById: (id) => events.find((e) => e.id === id) ?? null,
      addEvent: (data) => {
        const now = new Date().toISOString();
        const newEvent = {
          ...data,
          id: `evt-${Date.now()}`,
          status: "Active",
          createdAt: now,
          updatedAt: now,
        };
        setEvents((prev) => [newEvent, ...prev]);
        return newEvent;
      },
      updateEvent: (id, data) => {
        const now = new Date().toISOString();
        setEvents((prev) =>
          prev.map((event) => (event.id === id ? { ...event, ...data, updatedAt: now } : event))
        );
      },
      activateEvent: (id) => {
        setEvents((prev) => {
          const currentActive = prev.filter((event) => event.status === "Active").length;
          if (currentActive >= MAX_ACTIVE_EVENTS) return prev;
          const now = new Date().toISOString();
          return prev.map((event) =>
            event.id === id ? { ...event, status: "Active", updatedAt: now } : event
          );
        });
      },
    }),
    [events, activeCount]
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
