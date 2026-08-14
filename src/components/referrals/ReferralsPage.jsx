import { useMemo, useState } from "react";
import ReferralsHeader from "./ReferralsHeader";
import ReferralStats from "./ReferralStats";
import ReferralToolbar from "./ReferralToolbar";
import ReferralTable from "./ReferralTable";
import ReferralEmptyState from "./ReferralEmptyState";
import RecentReferrals from "./RecentReferrals";
import Pagination from "../rtor/Pagination";
import { useReferrals } from "../../context/ReferralsContext";
import { useMembers } from "../../context/MembersContext";
import { isToday, isThisWeek, isThisMonth, isSameDay } from "../../utils/formatReferralDate";

const PAGE_SIZE = 8;

export default function ReferralsPage() {
  const { members } = useMembers();
  const { referrals, loading } = useReferrals();
  const getMember = (id) => members.find((m) => m.uid === id) ?? null;

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const hasFilters =
    search.trim() !== "" || type !== "all" || dateFilter !== "all" || sort !== "newest";

  const filteredReferrals = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = referrals.filter((referral) => {
      if (type !== "all" && referral.type !== type) return false;

      if (dateFilter === "today" && !isToday(referral.createdAt)) return false;
      if (dateFilter === "week" && !isThisWeek(referral.createdAt)) return false;
      if (dateFilter === "month" && !isThisMonth(referral.createdAt)) return false;
      if (dateFilter === "custom" && customDate && !isSameDay(referral.createdAt, customDate)) return false;

      if (query === "") return true;

      const referrerMember = getMember(referral.referrerId);
      const connectorMember = getMember(referral.connectorId);
      const referredMember = getMember(referral.referredUserId);

      const haystack = [
        referral.referrerName,
        referral.connectorName,
        referral.referredUserName,
        referrerMember?.ridNo,
        connectorMember?.ridNo,
        referredMember?.ridNo,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    const sorted = [...result].sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return sort === "oldest" ? dateA - dateB : dateB - dateA;
    });

    return sorted;
  }, [referrals, members, search, type, dateFilter, customDate, sort]);

  const stats = useMemo(() => {
    const self = referrals.filter((r) => r.type === "self").length;
    const connect = referrals.filter((r) => r.type === "connect").length;
    return { total: referrals.length, self, connect };
  }, [referrals]);

  const totalPages = Math.max(1, Math.ceil(filteredReferrals.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedReferrals = filteredReferrals.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleClearFilters = () => {
    setSearch("");
    setType("all");
    setDateFilter("all");
    setCustomDate("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <ReferralsHeader />
      <ReferralStats stats={stats} />

      {!loading && referrals.length > 0 && <RecentReferrals referrals={referrals} />}

      <ReferralToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        type={type}
        onTypeChange={(value) => {
          setType(value);
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
        sort={sort}
        onSortChange={setSort}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <div className="flex justify-center p-8 text-text-secondary">Loading referrals...</div>
      ) : referrals.length === 0 ? (
        <ReferralEmptyState hasFilters={false} onClearFilters={handleClearFilters} />
      ) : filteredReferrals.length === 0 ? (
        <ReferralEmptyState hasFilters={hasFilters} onClearFilters={handleClearFilters} />
      ) : (
        <div className="space-y-4 animate-fade-in">
          <ReferralTable
            referrals={paginatedReferrals}
            startSerialNo={(currentPage - 1) * PAGE_SIZE + 1}
            getMember={getMember}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={filteredReferrals.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
