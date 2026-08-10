import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EventForm from "../components/newsEvents/EventForm";
import { useEvents } from "../context/EventsContext";
import { emptyEvent } from "../data/eventsData";

export default function EventFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, addEvent, updateEvent, activeCount, maxActiveEvents } = useEvents();

  const isEdit = mode === "edit";
  const existingEvent = isEdit ? getEventById(id) : null;

  if (isEdit && !existingEvent) {
    return (
      <div className="space-y-4">
        <Link
          to="/news-events"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to News & Events
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-text-secondary">
          Event not found.
        </div>
      </div>
    );
  }

  if (!isEdit && activeCount >= maxActiveEvents) {
    return (
      <div className="space-y-4">
        <Link
          to="/news-events"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to News & Events
        </Link>
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-text-secondary">
          Maximum 5 active events allowed. Deactivate an existing event before creating a new one.
        </div>
      </div>
    );
  }

  const initialData = isEdit ? existingEvent : { ...emptyEvent };

  const handleSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateEvent(existingEvent.id, formData, formData.imageUrl);
        navigate(`/news-events/${existingEvent.id}`);
      } else {
        const id = await addEvent(formData, formData.imageUrl);
        navigate(`/news-events/${id}`);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(isEdit ? `/news-events/${existingEvent.id}` : "/news-events");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={isEdit ? `/news-events/${existingEvent.id}` : "/news-events"}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={16} />
          {isEdit ? "Back to Event" : "Back to News & Events"}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-secondary">
          {isEdit ? "Edit Event" : "Create Event"}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {isEdit
            ? `Update details for ${existingEvent.name}`
            : "Fill in the event details to publish it for RMBF Erode United"}
        </p>
      </div>

      <EventForm
        initialData={initialData}
        isEdit={isEdit}
        activeCount={activeCount}
        maxActive={maxActiveEvents}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isEdit ? "Update Event" : "Create Event"}
      />
    </div>
  );
}
