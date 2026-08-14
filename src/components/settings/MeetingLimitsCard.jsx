import { useEffect, useRef, useState } from "react";
import { CalendarRange, Pencil, Check, X, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { REGULAR_MEETINGS_PER_TERM, DEFAULT_POWER_TEAM_MEETINGS_PER_TERM } from "../../utils/meetingTerm";
import {
  subscribeToMeetingLimits,
  ensureMeetingLimitsDoc,
  updateMeetingLimits,
  friendlyMeetingLimitsError,
} from "../../services/meetingLimitsService";

export default function MeetingLimitsCard() {
  const { user } = useAuth();
  const [powerTeamLimit, setPowerTeamLimit] = useState(DEFAULT_POWER_TEAM_MEETINGS_PER_TERM);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState("");
  const [rowError, setRowError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const ensuredRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeToMeetingLimits((data, exists) => {
      setPowerTeamLimit(data.powerTeamMeetingsPerTerm);
      setLoading(false);

      if (!exists && !ensuredRef.current && user?.uid) {
        ensuredRef.current = true;
        ensureMeetingLimitsDoc(user.uid).catch((err) => console.error("Failed to seed meeting limits:", err));
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const startEdit = () => {
    setIsEditing(true);
    setDraftValue(String(powerTeamLimit));
    setRowError("");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setDraftValue("");
    setRowError("");
  };

  const saveEdit = async () => {
    const parsed = Number(draftValue);

    if (draftValue.trim() === "" || Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      setRowError("Enter a valid number.");
      return;
    }
    if (!Number.isInteger(parsed)) {
      setRowError("Enter a whole number.");
      return;
    }
    if (parsed <= 0) {
      setRowError("Must be greater than 0.");
      return;
    }

    setSaving(true);
    setRowError("");
    try {
      await updateMeetingLimits({ powerTeamMeetingsPerTerm: parsed }, user?.uid);
      setSuccessMessage("Meeting limits updated successfully.");
      setIsEditing(false);
      setDraftValue("");
    } catch (err) {
      setRowError(friendlyMeetingLimitsError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-bg px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
          <CalendarRange size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-secondary">Meeting Limits</h3>
          <p className="text-xs text-text-secondary">Maximum meetings that can be created per term.</p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 border-b border-success-light bg-success-light px-5 py-2.5 text-sm text-success">
          <CheckCircle2 size={15} />
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="p-6 text-center text-sm text-text-secondary">Loading meeting limits...</div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Per Term</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-5 py-3 text-text">Regular Meetings</td>
                <td className="px-5 py-3 tabular-nums font-medium text-text">{REGULAR_MEETINGS_PER_TERM}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-bg px-2.5 py-1 text-xs font-medium text-text-secondary">
                    Fixed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-text">Power Team Meetings</td>
                <td className="px-5 py-3">
                  {isEditing ? (
                    <div>
                      <input
                        type="number"
                        step="1"
                        autoFocus
                        value={draftValue}
                        onChange={(e) => setDraftValue(e.target.value)}
                        className="w-24 rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {rowError && <p className="mt-1 text-xs text-danger">{rowError}</p>}
                    </div>
                  ) : (
                    <span className="tabular-nums font-medium text-text">{powerTeamLimit}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={saving}
                        className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={saving}
                        className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg disabled:opacity-50"
                      >
                        <X size={13} />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={startEdit}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
