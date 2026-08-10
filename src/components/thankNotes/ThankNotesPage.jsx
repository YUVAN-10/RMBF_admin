import { useMemo, useState } from "react";
import ThankNotesHeader from "./ThankNotesHeader";
import ThankNotesStats from "./ThankNotesStats";
import ThankNotesToolbar from "./ThankNotesToolbar";
import ThankNotesTable from "./ThankNotesTable";
import ThankNoteDetails from "./ThankNoteDetails";
import ThankNotesEmptyState from "./ThankNotesEmptyState";
import Pagination from "./Pagination";
import { thankNotesData } from "../../data/thankNotesData";

const PAGE_SIZE = 6;

const formatShortDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

const formatLongDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

const formatTime = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(date);

const getStartOfWeek = (date) => {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const weekday = utcDate.getUTCDay();
  const diff = (weekday + 6) % 7;
  utcDate.setUTCDate(utcDate.getUTCDate() - diff);
  return utcDate;
};

const isSameUtcDate = (a, b) =>
  a.getUTCFullYear() === b.getUTCFullYear() &&
  a.getUTCMonth() === b.getUTCMonth() &&
  a.getUTCDate() === b.getUTCDate();

const isSameUtcMonth = (a, b) =>
  a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();

export default function ThankNotesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const [selectedNote, setSelectedNote] = useState(null);

  const enrichedNotes = useMemo(
    () =>
      thankNotesData.map((note) => {
        const date = new Date(note.createdAt);
        return {
          ...note,
          rawDate: date,
          displayDate: formatShortDate(date),
          detailDate: formatLongDate(date),
          displayTime: formatTime(date),
        };
      }),
    []
  );

  const nowUtc = useMemo(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }, []);

  const startOfWeek = useMemo(() => getStartOfWeek(nowUtc), [nowUtc]);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enrichedNotes.filter((note) => {
      const matchesSearch =
        query === "" ||
        note.fromName.toLowerCase().includes(query) ||
        note.toName.toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }

      if (filter === "today") {
        return isSameUtcDate(note.rawDate, nowUtc);
      }

      if (filter === "this-week") {
        return note.rawDate >= startOfWeek && note.rawDate <= nowUtc;
      }

      if (filter === "this-month") {
        return isSameUtcMonth(note.rawDate, nowUtc);
      }

      if (filter === "date") {
        if (!selectedDate) {
          return true;
        }
        const selectedUtc = new Date(`${selectedDate}T00:00:00.000Z`);
        return isSameUtcDate(note.rawDate, selectedUtc);
      }

      return true;
    });
  }, [enrichedNotes, filter, nowUtc, search, selectedDate, startOfWeek]);

  const totalPages = Math.max(1, Math.ceil(filteredNotes.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedNotes = filteredNotes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = useMemo(() => {
    const thisMonthNotes = enrichedNotes.filter((note) => isSameUtcMonth(note.rawDate, nowUtc));
    return {
      total: enrichedNotes.length,
      month: thisMonthNotes.length,
      today: enrichedNotes.filter((note) => isSameUtcDate(note.rawDate, nowUtc)).length,
      monthValue: thisMonthNotes.reduce((sum, note) => sum + (note.value || 0), 0),
    };
  }, [enrichedNotes, nowUtc]);

  const hasFilters = search.trim() !== "" || filter !== "all" || selectedDate !== "";

  const handleClearFilters = () => {
    setSearch("");
    setFilter("all");
    setSelectedDate("");
    setPage(1);
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
  };

  return (
    <div className="space-y-6">
      <ThankNotesHeader />

      <ThankNotesStats stats={stats} />

      <ThankNotesToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filter={filter}
        onFilterChange={(value) => {
          setFilter(value);
          setPage(1);
        }}
        selectedDate={selectedDate}
        onDateChange={(value) => {
          setSelectedDate(value);
          setPage(1);
        }}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
      />

      {selectedNote ? (
        <ThankNoteDetails note={selectedNote} onBack={() => setSelectedNote(null)} />
      ) : null}

      {thankNotesData.length === 0 ? (
        <ThankNotesEmptyState />
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-text">Thank Notes</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Browse thank notes shared between members.
                </p>
              </div>
              <p className="rounded-full border border-border bg-bg px-3 py-1 text-sm text-text-secondary">
                {filteredNotes.length} results
              </p>
            </div>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-text">No matching thank notes found</p>
              <p className="mt-2 max-w-md mx-auto text-sm text-text-secondary">
                Try a different search term or clear the filters to see all thank notes.
              </p>
            </div>
          ) : (
            <>
              <ThankNotesTable
                notes={paginatedNotes}
                startSerialNo={(currentPage - 1) * PAGE_SIZE + 1}
                onViewNote={handleViewNote}
              />
              <Pagination
                currentPage={currentPage}
                totalItems={filteredNotes.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
