import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import MeetingForm from "../components/meetings/MeetingForm";
import MeetingQRCode from "../components/meetings/MeetingQRCode";
import { useMeetings } from "../context/MeetingsContext";
import { emptyMeeting } from "../data/meetingsData";
import { isMeetingEditable } from "../utils/meetingStatus";

export default function MeetingFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMeetingById, addMeeting, updateMeeting } = useMeetings();
  const [createdMeeting, setCreatedMeeting] = useState(null);

  const isEdit = mode === "edit";
  const existingMeeting = isEdit ? getMeetingById(id) : null;

  if (isEdit && !existingMeeting) {
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

  if (isEdit && existingMeeting && !isMeetingEditable(existingMeeting)) {
    return (
      <div className="space-y-4">
        <Link
          to={`/meetings/${existingMeeting.id}`}
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
          <p className="text-sm font-medium">Meeting created successfully</p>
        </div>

        <div className="mx-auto max-w-md">
          <MeetingQRCode meeting={createdMeeting} />
          <button
            type="button"
            onClick={() => navigate(`/meetings/${createdMeeting.id}`)}
            className="mt-4 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const initialData = isEdit ? existingMeeting : { ...emptyMeeting };

  const handleSubmit = (formData) => {
    if (isEdit) {
      updateMeeting(existingMeeting.id, formData);
      navigate(`/meetings/${existingMeeting.id}`);
    } else {
      const created = addMeeting(formData);
      setCreatedMeeting(created);
    }
  };

  const handleCancel = () => {
    navigate(isEdit ? `/meetings/${existingMeeting.id}` : "/meetings");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={isEdit ? `/meetings/${existingMeeting.id}` : "/meetings"}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          {isEdit ? "Back to Meeting" : "Back to Meetings"}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-secondary">
          {isEdit ? "Edit Meeting" : "Create Meeting"}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {isEdit
            ? `Update details for ${existingMeeting.meetingName}`
            : "A QR code will be generated automatically once the meeting is created."}
        </p>
      </div>

      <MeetingForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isEdit ? "Update Meeting" : "Create Meeting"}
      />
    </div>
  );
}
