import { Users, CalendarDays, Repeat, PartyPopper } from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import { statsData } from "../data/dashboardData";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader adminName="Gowtham S" />

      {/* Main statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Members"
          value={statsData.totalMembers.value}
          subtext={statsData.totalMembers.change}
          trend={statsData.totalMembers.trend}
          delay={0}
        />
        <StatCard
          icon={CalendarDays}
          label="Total Meetings"
          value={statsData.totalMeetings.value}
          subtext={`${statsData.totalMeetings.completed} completed · ${statsData.totalMeetings.upcoming} upcoming`}
          delay={60}
        />
        <StatCard
          icon={Repeat}
          label="Total R to R"
          value={statsData.totalRtoR.value}
          subtext={`${statsData.totalRtoR.monthly} this month`}
          delay={120}
        />
        <StatCard
          icon={PartyPopper}
          label="Total Events"
          value={statsData.totalEvents.value}
          subtext={`${statsData.totalEvents.upcoming} upcoming events`}
          delay={180}
        />
      </div>
    </div>
  );
}
