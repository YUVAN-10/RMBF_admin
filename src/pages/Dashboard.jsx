import { Users, CalendarDays, Repeat, PartyPopper } from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import MemberGrowthChart from "../components/dashboard/MemberGrowthChart";
import ActivityChart from "../components/dashboard/ActivityChart";
import RecentMeetings from "../components/dashboard/RecentMeetings";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";
import {
  statsData,
  memberGrowthData,
  activityOverviewData,
  recentMeetings,
  upcomingEvents,
  recentActivity,
} from "../data/dashboardData";

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

      {/* Quick overview */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MemberGrowthChart data={memberGrowthData} />
        <ActivityChart data={activityOverviewData} />
      </div>

      {/* Meetings + Events */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentMeetings meetings={recentMeetings} />
        </div>
        <UpcomingEvents events={upcomingEvents} />
      </div>

      {/* Activity + Quick actions */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentActivity activities={recentActivity} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
