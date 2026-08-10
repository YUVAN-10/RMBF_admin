import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMeetings } from "../context/MeetingsContext";
import { useMembers } from "../context/MembersContext";
import MeetingDetails from "../components/meetings/MeetingDetails";

export default function MeetingDetailsPage() {
  const { id } = useParams();
  const { getMeetingById } = useMeetings();
  const { members } = useMembers();
  const meeting = getMeetingById(id);

  if (!meeting) {
    return (
      <div className="space-y-4">
        <Link
          to="/meetings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to Meetings
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-text-secondary">
          Meeting not found.
        </div>
      </div>
    );
  }

  const activeMembers = members.filter((member) => member.status === "Active");

  return <MeetingDetails meeting={meeting} activeMembers={activeMembers} />;
}
