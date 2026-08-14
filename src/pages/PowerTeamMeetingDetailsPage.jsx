import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePowerTeamMeetings } from "../context/PowerTeamMeetingsContext";
import { useMembers } from "../context/MembersContext";
import PowerTeamMeetingDetails from "../components/meetings/PowerTeamMeetingDetails";

export default function PowerTeamMeetingDetailsPage() {
  const { id } = useParams();
  const { getMeetingById, loading } = usePowerTeamMeetings();
  const { members } = useMembers();
  const meeting = getMeetingById(id);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="space-y-4">
        <Link
          to="/power-team-meetings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to Power Team Meetings
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-text-secondary">
          Power Team Meeting not found.
        </div>
      </div>
    );
  }

  const activeMembers = members.filter((member) => member.status === "Active");

  return <PowerTeamMeetingDetails meeting={meeting} activeMembers={activeMembers} />;
}
