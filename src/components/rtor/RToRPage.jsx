import { useMemo, useState } from "react";
import RToRHeader from "./RToRHeader";
import RToRStats from "./RToRStats";
import RToRToolbar from "./RToRToolbar";
import RToRTable from "./RToRTable";
import RToREmptyState from "./RToREmptyState";
import Pagination from "./Pagination";
import { useRToR } from "../../context/RToRContext";
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

function isThisMonth(a, b) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();
}

export default function RToRPage() {
  const { members } = useMembers();
  const { rtorRecords: initialRToR, loading } = useRToR();
  const getMember = (uid) => members.find((m) => m.uid === uid) ?? null;

  const [search, setSearch] = useState("");
  const [fromMember, setFromMember] = useState("all");
  const [page, setPage] = useState(1);

  const now = useMemo(() => new Date(), []);
  const today = useMemo(() => startOfUtcDay(now), [now]);

  const hasFilters = search.trim() !== "" || fromMember !== "all";

  // How many records each member appears as the "From" side of — matches
  // exactly what selecting that member in the filter below will show.
  const memberCounts = useMemo(() => {
    const counts = {};
    for (const record of initialRToR) {
      counts[record.fromUserId] = (counts[record.fromUserId] || 0) + 1;
    }
    return counts;
  }, [initialRToR]);

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

      return true;
    });
    
    return [...result].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
        return dateB - dateA;
    });
  }, [search, fromMember, members, initialRToR]);

  const stats = useMemo(() => {
    const currentMonth = new Date().getUTCMonth();
    const isTerm1 = currentMonth >= 0 && currentMonth <= 5;
    
    const currentTermRecords = filteredRecords.filter((r) => {
      const date = r.createdAt?.toDate ? r.createdAt.toDate() : new Date();
      const m = date.getUTCMonth();
      return isTerm1 ? (m >= 0 && m <= 5) : (m >= 6 && m <= 11);
    });

    const userCounts = {};
    for (const record of currentTermRecords) {
      userCounts[record.fromUserId] = (userCounts[record.fromUserId] || 0) + 1;
    }

    let topUserId = null;
    let topUserCount = 0;
    for (const [userId, count] of Object.entries(userCounts)) {
      if (count > topUserCount) {
        topUserCount = count;
        topUserId = userId;
      }
    }
    
    let topUserName = "No records";
    if (topUserId) {
      const topMember = members.find((m) => m.uid === topUserId);
      topUserName = topMember ? topMember.fullName : "Unknown";
    }

    return {
      total: filteredRecords.length,
      currentTerm: currentTermRecords.length,
      currentTermName: isTerm1 ? "Term 1 (Jan-Jun)" : "Term 2 (Jul-Dec)",
      topUserName,
      topUserCount,
    };
  }, [filteredRecords, members]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch("");
    setFromMember("all");
    setPage(1);
  };

  const searchedFromCount = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query === "") return 0;

    const currentMonth = new Date().getUTCMonth();
    const isTerm1 = currentMonth >= 0 && currentMonth <= 5;

    return initialRToR.filter((record) => {
      const fromMemberDetails = getMember(record.fromUserId);
      const matchesFrom = record.fromName.toLowerCase().includes(query) || 
                          (fromMemberDetails?.ridNo || "").toLowerCase().includes(query);
      if (!matchesFrom) return false;

      const date = record.createdAt?.toDate ? record.createdAt.toDate() : new Date();
      const m = date.getUTCMonth();
      return isTerm1 ? (m >= 0 && m <= 5) : (m >= 6 && m <= 11);
    }).length;
  }, [search, members, initialRToR]);

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
        fromMember={fromMember}
        onFromMemberChange={(value) => {
          setFromMember(value);
          setPage(1);
        }}
        members={members}
        memberCounts={memberCounts}
        totalCount={initialRToR.length}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
        currentTermCount={searchedFromCount}
      />

      {loading ? (
         <div className="flex justify-center p-8 text-text-secondary">Loading R to R records...</div>
      ) : initialRToR.length === 0 ? (
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
