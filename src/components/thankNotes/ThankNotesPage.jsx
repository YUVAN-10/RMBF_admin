import { useMemo, useState } from "react";
import ThankNotesHeader from "./ThankNotesHeader";
import ThankNotesStats from "./ThankNotesStats";
import ThankNotesToolbar from "./ThankNotesToolbar";
import ThankNotesTable from "./ThankNotesTable";
import ThankNotesEmptyState from "./ThankNotesEmptyState";
import Pagination from "./Pagination";
import { useThankNotes } from "../../context/ThankNotesContext";
import { useMembers } from "../../context/MembersContext";
import { resolveMemberName } from "../../utils/nameResolver";

const PAGE_SIZE = 6;

const formatShortDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

const formatLongDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

const formatTime = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

export default function ThankNotesPage() {
  const { thankNotes, loading } = useThankNotes();
  const { members } = useMembers();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const enrichedNotes = useMemo(
    () =>
      thankNotes.map((note) => {
        const rawDate = note.createdAt?.toDate ? note.createdAt.toDate() : new Date();
        const fromName = resolveMemberName(note, "from", members);
        const toName = resolveMemberName(note, "to", members);
        return {
          ...note,
          fromName,
          toName,
          rawDate,
          displayDate: formatShortDate(rawDate),
          detailDate: formatLongDate(rawDate),
          displayTime: formatTime(rawDate),
        };
      }),
    [thankNotes, members]
  );

  const searchedNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query === "") return enrichedNotes;
    
    return enrichedNotes.filter((note) =>
      (note.fromName || "").toLowerCase().includes(query) ||
      (note.toName || "").toLowerCase().includes(query)
    );
  }, [enrichedNotes, search]);

  const filteredNotes = useMemo(() => {
    return searchedNotes.filter((note) => {
      const month = note.rawDate.getUTCMonth();
      
      if (filter === "term-1") {
        return month >= 0 && month <= 5; // Jan to Jun
      }

      if (filter === "term-2") {
        return month >= 6 && month <= 11; // Jul to Dec
      }

      return true;
    });
  }, [searchedNotes, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredNotes.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedNotes = filteredNotes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = useMemo(() => {
    const currentMonth = new Date().getUTCMonth();
    const isTerm1 = currentMonth >= 0 && currentMonth <= 5;

    const currentTermNotes = searchedNotes.filter((note) => {
      const m = note.rawDate.getUTCMonth();
      return isTerm1 ? (m >= 0 && m <= 5) : (m >= 6 && m <= 11);
    });

    const userCounts = {};
    for (const note of currentTermNotes) {
      userCounts[note.fromName] = (userCounts[note.fromName] || 0) + 1;
    }

    let topUserName = "No records";
    let topUserCount = 0;
    for (const [name, count] of Object.entries(userCounts)) {
      if (count > topUserCount) {
        topUserCount = count;
        topUserName = name;
      }
    }

    return {
      total: searchedNotes.length,
      currentTerm: currentTermNotes.length,
      currentTermValue: currentTermNotes.reduce((sum, note) => sum + (note.value || 0), 0),
      currentTermName: isTerm1 ? "Term 1 (Jan-Jun)" : "Term 2 (Jul-Dec)",
      topUserName,
      topUserCount,
    };
  }, [searchedNotes]);

  const hasFilters = search.trim() !== "" || filter !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setFilter("all");
    setPage(1);
  };

  const searchedFromCount = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query === "") return 0;

    const currentMonth = new Date().getUTCMonth();
    const isTerm1 = currentMonth >= 0 && currentMonth <= 5;

    return enrichedNotes.filter((note) => {
      const matchesFrom = note.fromName.toLowerCase().includes(query);
      if (!matchesFrom) return false;

      const m = note.rawDate.getUTCMonth();
      return isTerm1 ? (m >= 0 && m <= 5) : (m >= 6 && m <= 11);
    }).length;
  }, [search, enrichedNotes]);

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
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
        currentTermCount={searchedFromCount}
      />

      {loading ? (
        <div className="flex justify-center p-8 text-text-secondary">Loading thank notes...</div>
      ) : thankNotes.length === 0 ? (
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
