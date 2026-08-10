import EventCard from "./EventCard";

export default function EventGrid({ events, onActivate, canActivate }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onActivate={onActivate} canActivate={canActivate} />
      ))}
    </div>
  );
}
