import { useMemo, useState } from "react";
import { Users, CalendarDays, Repeat, PartyPopper, Calendar } from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import { useMembers } from "../context/MembersContext";
import { useMeetings } from "../context/MeetingsContext";
import { useEvents } from "../context/EventsContext";
import { useThankNotes } from "../context/ThankNotesContext";
import { useRToR } from "../context/RToRContext";

export default function Dashboard() {
  const { members } = useMembers();
  const { meetings } = useMeetings();
  const { events } = useEvents();
  const { thankNotes } = useThankNotes();
  const { rtorRecords } = useRToR();

  const currentMonth = new Date().getUTCMonth();
  const initialTerm = currentMonth >= 0 && currentMonth <= 5 ? "term1" : "term2";
  const [termFilter, setTermFilter] = useState(initialTerm);

  const stats = useMemo(() => {
    const isTerm1 = termFilter === "term1";
    const termName = isTerm1 ? "Term 1" : "Term 2";

    const inTerm = (dateVal) => {
      if (!dateVal) return false;
      const date = dateVal?.toDate ? dateVal.toDate() : new Date(dateVal);
      const m = date.getUTCMonth();
      return isTerm1 ? (m >= 0 && m <= 5) : (m >= 6 && m <= 11);
    };

    const termMembers = members.filter((m) => inTerm(m.createdAt)).length;
    
    const termMeetings = meetings.filter((m) => inTerm(m.meetingDate));
    const completedMeetings = termMeetings.filter((m) => m.status === "completed").length;
    const upcomingMeetings = termMeetings.filter((m) => m.status === "upcoming").length;

    const termRToR = rtorRecords.filter((r) => inTerm(r.createdAt)).length;

    const termEvents = events.filter((e) => inTerm(e.eventDate));
    const upcomingEvents = termEvents.filter((e) => e.status === "upcoming").length;

    return {
      termName,
      members: {
        total: members.length,
        newThisTerm: termMembers,
      },
      meetings: {
        total: termMeetings.length,
        completed: completedMeetings,
        upcoming: upcomingMeetings,
      },
      rtor: {
        total: termRToR,
      },
      events: {
        total: termEvents.length,
        upcoming: upcomingEvents,
      },
    };
  }, [members, meetings, events, thankNotes, rtorRecords, termFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardHeader adminName="Gowtham S" />
        
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1 shadow-sm">
          <Calendar size={16} className="ml-2 text-text-secondary" />
          <select
            value={termFilter}
            onChange={(e) => setTermFilter(e.target.value)}
            className="border-0 bg-transparent py-1.5 pl-2 pr-6 text-sm font-medium text-text focus:ring-0 cursor-pointer outline-none"
          >
            <option value="term1">Term 1 (Jan - Jun)</option>
            <option value="term2">Term 2 (Jul - Dec)</option>
          </select>
        </div>
      </div>

      {/* Main statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Members"
          value={stats.members.total}
          subtext={`+${stats.members.newThisTerm} in ${stats.termName}`}
          trend="up"
          delay={0}
        />
        <StatCard
          icon={CalendarDays}
          label={`${stats.termName} Meetings`}
          value={stats.meetings.total}
          subtext={`${stats.meetings.completed} completed · ${stats.meetings.upcoming} upcoming`}
          delay={60}
        />
        <StatCard
          icon={Repeat}
          label={`${stats.termName} R to R`}
          value={stats.rtor.total}
          subtext={`Interactions this term`}
          delay={120}
        />
        <StatCard
          icon={PartyPopper}
          label={`${stats.termName} Events`}
          value={stats.events.total}
          subtext={`${stats.events.upcoming} upcoming events`}
          delay={180}
        />
      </div>
    </div>
  );
}
