import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import PowerTeamMeetingForm from "../components/meetings/PowerTeamMeetingForm";
import MeetingQRCode from "../components/meetings/MeetingQRCode";
import { usePowerTeamMeetings } from "../context/PowerTeamMeetingsContext";
import { emptyPowerTeamMeeting } from "../data/powerTeamMeetingsData";
import { isMeetingEditable } from "../utils/meetingStatus";
import { buildPowerTeamQrPayload } from "../utils/qrToken";
import { MeetingLimitError } from "../services/powerTeamMeetingService";

export default function PowerTeamMeetingFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMeetingById, addMeeting, updateMeeting, loading } = usePowerTeamMeetings();
  const [createdMeeting, setCreatedMeeting] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === "edit";
  const existingMeeting = isEdit ? getMeetingById(id) : null;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isEdit && !existingMeeting) {
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

  if (isEdit && existingMeeting && !isMeetingEditable(existingMeeting)) {
    return (
      <div className="space-y-4">
        <Link
          to={`/power-team-meetings/${existingMeeting.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to Meeting
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-text-secondary">
          Only upcoming meetings can be edited.
        </div>
      </div>
    );
  }

  // Immediately after creating a meeting, show its QR code instead of
  // navigating away — this is the "Meeting Created" screen.
  if (createdMeeting) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 size={20} />
          <p className="text-sm font-medium">Power Team Meeting created successfully</p>
        </div>

        <div className="mx-auto max-w-md">
          <MeetingQRCode meeting={createdMeeting} payload={buildPowerTeamQrPayload(createdMeeting)} />
          <button
            type="button"
            onClick={() => navigate(`/power-team-meetings/${createdMeeting.id}`)}
            className="mt-4 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const initialData = isEdit ? existingMeeting : { ...emptyPowerTeamMeeting };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateMeeting(existingMeeting.id, formData);
        navigate(`/power-team-meetings/${existingMeeting.id}`);
      } else {
        const created = await addMeeting(formData);
        setCreatedMeeting(created);
      }
    } catch (error) {
      console.error("Error saving power team meeting:", error);
      alert(error instanceof MeetingLimitError ? error.message : "Failed to save meeting. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(isEdit ? `/power-team-meetings/${existingMeeting.id}` : "/power-team-meetings");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={isEdit ? `/power-team-meetings/${existingMeeting.id}` : "/power-team-meetings"}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          {isEdit ? "Back to Meeting" : "Back to Power Team Meetings"}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-secondary">
          {isEdit ? "Edit Power Team Meeting" : "Create Power Team Meeting"}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {isEdit
            ? `Update details for ${existingMeeting.meetingName}`
            : "A QR code will be generated automatically once the meeting is created."}
        </p>
      </div>

      <PowerTeamMeetingForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isEdit ? "Update Meeting" : "Create Meeting"}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
