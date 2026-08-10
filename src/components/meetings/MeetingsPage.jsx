import { useMemo, useState } from "react";
import MeetingsHeader from "./MeetingsHeader";
import MeetingStats from "./MeetingStats";
import MeetingToolbar from "./MeetingToolbar";
import MeetingsTable from "./MeetingsTable";
import MeetingEmptyState from "./MeetingEmptyState";
import CancelMeetingDialog from "./CancelMeetingDialog";
import Pagination from "./Pagination";
import { useMeetings } from "../../context/MeetingsContext";
import { useMembers } from "../../context/MembersContext";
import { computeMeetingStatus } from "../../utils/meetingStatus";

const PAGE_SIZE = 5;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isToday(dateStr) {
  return startOfDay(dateStr).getTime() === startOfDay(new Date()).getTime();
}

function isThisWeek(dateStr) {
  const d = startOfDay(dateStr);
  const today = startOfDay(new Date());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return d >= weekStart && d <= weekEnd;
}

function isThisMonth(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
}

function sortMeetings(meetings, sortBy) {
  const sorted = [...meetings];
  switch (sortBy) {
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "upcoming":
      return sorted.sort((a, b) => new Date(a.meetingDate) - new Date(b.meetingDate));
    case "newest":
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export default function MeetingsPage() {
  const { meetings, cancelMeeting } = useMeetings();
  const { members } = useMembers();
  const totalActiveMembers = members.filter((m) => m.status === "Active").length;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [meetingToCancel, setMeetingToCancel] = useState(null);

  const hasFilters = search.trim() !== "" || statusFilter !== "all" || dateFilter !== "all";

  const stats = useMemo(() => {
    const upcoming = meetings.filter((m) => computeMeetingStatus(m) === "upcoming").length;
    const completed = meetings.filter((m) => computeMeetingStatus(m) === "completed").length;
    const totalAttendance = meetings.reduce((sum, m) => sum + m.attendance.length, 0);
    return { total: meetings.length, upcoming, completed, totalAttendance };
  }, [meetings]);

  const filteredMeetings = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = meetings.filter((meeting) => {
      const matchesQuery =
        query === "" ||
        meeting.meetingName.toLowerCase().includes(query) ||
        (meeting.place || "").toLowerCase().includes(query);

      if (!matchesQuery) return false;

      if (statusFilter !== "all" && computeMeetingStatus(meeting) !== statusFilter) {
        return false;
      }

      switch (dateFilter) {
        case "today":
          return isToday(meeting.meetingDate);
        case "this-week":
          return isThisWeek(meeting.meetingDate);
        case "this-month":
          return isThisMonth(meeting.meetingDate);
        case "custom":
          return !customDate || meeting.meetingDate === customDate;
        case "all":
        default:
          return true;
      }
    });

    return sortMeetings(result, sortBy);
  }, [meetings, search, statusFilter, dateFilter, customDate, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredMeetings.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedMeetings = filteredMeetings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateFilter("all");
    setCustomDate("");
    setPage(1);
  };

  const handleConfirmCancel = () => {
    if (meetingToCancel) {
      cancelMeeting(meetingToCancel.id);
      setMeetingToCancel(null);
    }
  };

  return (
    <div className="space-y-6">
      <MeetingsHeader />
      <MeetingStats stats={stats} />

      <MeetingToolbar
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
        sortBy={sortBy}
        onSortByChange={setSortBy}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
      />

      {filteredMeetings.length === 0 ? (
        <MeetingEmptyState hasFilters={hasFilters} onClearFilters={handleClearFilters} />
      ) : (
        <div className="space-y-4 animate-fade-in">
          <MeetingsTable
            meetings={paginatedMeetings}
            startSerialNo={(currentPage - 1) * PAGE_SIZE + 1}
            totalActiveMembers={totalActiveMembers}
            onCancelClick={setMeetingToCancel}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={filteredMeetings.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}

      <CancelMeetingDialog
        open={Boolean(meetingToCancel)}
        onDismiss={() => setMeetingToCancel(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
