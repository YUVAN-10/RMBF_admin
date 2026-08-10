import { useMemo, useState } from "react";
import RToRHeader from "./RToRHeader";
import RToRStats from "./RToRStats";
import RToRToolbar from "./RToRToolbar";
import RToRTable from "./RToRTable";
import RToREmptyState from "./RToREmptyState";
import Pagination from "./Pagination";
import { initialRToR } from "../../data/rtorData";
import { useMembers } from "../../context/MembersContext";

const PAGE_SIZE = 6;

function startOfUtcDay(date) {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function isSameUtcDate(a, b) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function getStartOfWeek(date) {
  const utcDate = startOfUtcDay(date);
  const diff = (utcDate.getUTCDay() + 6) % 7;
  utcDate.setUTCDate(utcDate.getUTCDate() - diff);
  return utcDate;
}

function isThisMonth(a, b) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();
}

function sortRecords(records, sortBy) {
  const sorted = [...records];
  return sortBy === "oldest"
    ? sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    : sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export default function RToRPage() {
  const { members } = useMembers();
  const getMember = (uid) => members.find((m) => m.uid === uid) ?? null;

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [fromMember, setFromMember] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const now = useMemo(() => new Date(), []);
  const today = useMemo(() => startOfUtcDay(now), [now]);
  const weekStart = useMemo(() => getStartOfWeek(now), [now]);

  const hasFilters = search.trim() !== "" || dateFilter !== "all" || fromMember !== "all";

  const stats = useMemo(() => {
    return {
      total: initialRToR.length,
      month: initialRToR.filter((r) => isThisMonth(new Date(r.createdAt), now)).length,
      today: initialRToR.filter((r) => isSameUtcDate(new Date(r.createdAt), today)).length,
    };
  }, [now, today]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = initialRToR.filter((record) => {
      const fromMemberDetails = getMember(record.fromUserId);
      const toMemberDetails = getMember(record.toUserId);

      const matchesQuery =
        query === "" ||
        record.fromName.toLowerCase().includes(query) ||
        record.toName.toLowerCase().includes(query) ||
        (fromMemberDetails?.ridNo || "").toLowerCase().includes(query) ||
        (toMemberDetails?.ridNo || "").toLowerCase().includes(query);

      if (!matchesQuery) return false;
      if (fromMember !== "all" && record.fromUserId !== fromMember) return false;

      const recordDate = new Date(record.createdAt);
      switch (dateFilter) {
        case "today":
          return isSameUtcDate(recordDate, today);
        case "this-week":
          return recordDate >= weekStart && recordDate <= now;
        case "this-month":
          return isThisMonth(recordDate, now);
        case "custom":
          if (!customDate) return true;
          return isSameUtcDate(recordDate, new Date(`${customDate}T00:00:00.000Z`));
        case "all":
        default:
          return true;
      }
    });

    return sortRecords(result, sortBy);
  }, [search, dateFilter, customDate, fromMember, sortBy, today, weekStart, now, members]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch("");
    setDateFilter("all");
    setCustomDate("");
    setFromMember("all");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <RToRHeader />
      <RToRStats stats={stats} />

      <RToRToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        dateFilter={dateFilter}
        onDateFilterChange={(value) => {
          setDateFilter(value);
          setPage(1);
        }}
        customDate={customDate}
        onCustomDateChange={(value) => {
          setCustomDate(value);
          setPage(1);
        }}
        fromMember={fromMember}
        onFromMemberChange={(value) => {
          setFromMember(value);
          setPage(1);
        }}
        members={members}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
      />

      {initialRToR.length === 0 ? (
        <RToREmptyState hasFilters={false} onClearFilters={handleClearFilters} />
      ) : filteredRecords.length === 0 ? (
        <RToREmptyState hasFilters={hasFilters} onClearFilters={handleClearFilters} />
      ) : (
        <div className="space-y-4 animate-fade-in">
          <RToRTable
            records={paginatedRecords}
            startSerialNo={(currentPage - 1) * PAGE_SIZE + 1}
            getMember={getMember}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={filteredRecords.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
