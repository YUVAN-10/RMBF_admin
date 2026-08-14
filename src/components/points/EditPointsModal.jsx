import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { awardPoints, friendlyPointsError } from "../../services/pointsService";

export default function EditPointsModal({ member, entry, onClose, onSaved }) {
  const [mode, setMode] = useState("add");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = Number(amount);

    if (amount.trim() === "" || !Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
      setError("Enter a whole number greater than 0.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const delta = mode === "add" ? parsed : -parsed;
      const result = await awardPoints(member.uid, delta, "manual_adjustment", {
        description: description.trim(),
      });
      if (!result.success) {
        setError(result.message || "Could not update points.");
        return;
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(friendlyPointsError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-secondary/40 backdrop-blur-[1px]" onClick={saving ? undefined : onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg animate-fade-in"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-text">Edit Points</h2>
            <p className="mt-1 text-sm text-text-secondary">{member.fullName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-text-secondary transition-colors hover:text-text disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 text-xs text-text-secondary">
          Current: <span className="font-medium text-text">{entry.points.toLocaleString()}</span> /{" "}
          {entry.maxPoints.toLocaleString()} points
        </p>

        <div className="mt-5 flex rounded-lg border border-border p-1">
          <button
            type="button"
            onClick={() => setMode("add")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "add" ? "bg-primary text-white" : "text-text-secondary hover:text-text"
            }`}
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setMode("deduct")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "deduct" ? "bg-danger text-white" : "text-text-secondary hover:text-text"
            }`}
          >
            Deduct
          </button>
        </div>

        <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-text-secondary">
          Points
          <input
            type="number"
            min="1"
            step="1"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. 50"
          />
        </label>

        <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-text-secondary">
          Reason (optional)
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. Bonus for extra referral"
          />
        </label>

        {error && <p className="mt-3 text-xs text-danger">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
