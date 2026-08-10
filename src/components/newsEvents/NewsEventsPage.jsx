import { useMemo, useState } from "react";
import NewsEventsHeader from "./NewsEventsHeader";
import EventLimitIndicator from "./EventLimitIndicator";
import EventToolbar from "./EventToolbar";
import EventGrid from "./EventGrid";
import EmptyEventsState from "./EmptyEventsState";
import Pagination from "./Pagination";
import { useEvents } from "../../context/EventsContext";
import { isPastEvent } from "../../utils/eventStatus";

const PAGE_SIZE = 6;

function sortEvents(events, sortBy) {
  const sorted = [...events];
  switch (sortBy) {
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "upcoming-date":
      return sorted.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    case "newest":
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export default function NewsEventsPage() {
  const { events, activeCount, maxActiveEvents, activateEvent } = useEvents();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const atLimit = activeCount >= maxActiveEvents;
  const hasFilters = search.trim() !== "" || statusFilter !== "all";

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = events.filter((event) => {
      const matchesQuery =
        query === "" ||
        event.name.toLowerCase().includes(query) ||
        (event.location || "").toLowerCase().includes(query);

      if (!matchesQuery) return false;

      switch (statusFilter) {
        case "active":
          return event.status === "Active";
        case "inactive":
          return event.status === "Inactive";
        case "upcoming":
          return event.status === "Active" && !isPastEvent(event.eventDate);
        case "completed":
          return event.status === "Active" && isPastEvent(event.eventDate);
        case "all":
        default:
          return true;
      }
    });

    return sortEvents(result, sortBy);
  }, [events, search, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <NewsEventsHeader disabled={atLimit} />
      <EventLimitIndicator activeCount={activeCount} max={maxActiveEvents} />

      <EventToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
      />

      {filteredEvents.length === 0 ? (
        <EmptyEventsState hasFilters={hasFilters} onClearFilters={handleClearFilters} disabled={atLimit} />
      ) : (
        <div className="space-y-4 animate-fade-in">
          <EventGrid events={paginatedEvents} onActivate={activateEvent} canActivate={!atLimit} />
          <Pagination
            currentPage={currentPage}
            totalItems={filteredEvents.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
