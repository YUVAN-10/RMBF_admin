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

export default function MeetingsPage() {
  const { meetings, cancelMeeting } = useMeetings();
  const { members } = useMembers();
  const totalActiveMembers = members.filter((m) => m.status === "Active").length;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [meetingToCancel, setMeetingToCancel] = useState(null);

  const hasFilters = search.trim() !== "" || statusFilter !== "all";

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

      return true;
    });

    return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [meetings, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMeetings.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedMeetings = filteredMeetings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
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
