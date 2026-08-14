import { useEffect, useRef, useState } from "react";
import { Award, Pencil, Check, X, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { POINTS_MASTER_FIELDS, DEFAULT_POINTS_MASTER } from "../../data/pointsMasterData";
import {
  subscribeToPointsMaster,
  ensurePointsMasterDoc,
  updatePointsMaster,
  friendlyPointsSettingsError,
} from "../../services/pointsSettingsService";

export default function PointsMasterCard() {
  const { user } = useAuth();
  const [values, setValues] = useState(DEFAULT_POINTS_MASTER);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [draftValue, setDraftValue] = useState("");
  const [rowError, setRowError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const ensuredRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeToPointsMaster((data, exists) => {
      setValues(data);
      setLoading(false);

      if (!exists && !ensuredRef.current && user?.uid) {
        ensuredRef.current = true;
        ensurePointsMasterDoc(user.uid).catch((err) => console.error("Failed to seed points master:", err));
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const startEdit = (key, currentValue) => {
    setEditingKey(key);
    setDraftValue(String(currentValue));
    setRowError("");
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setDraftValue("");
    setRowError("");
  };

  const saveEdit = async (key) => {
    const parsed = Number(draftValue);

    if (draftValue.trim() === "" || Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      setRowError("Enter a valid number.");
      return;
    }
    if (!Number.isInteger(parsed)) {
      setRowError("Enter a whole number.");
      return;
    }
    if (key === "monthlyPointLimit" && parsed <= 0) {
      setRowError("Monthly point limit must be greater than 0.");
      return;
    }

    setSaving(true);
    setRowError("");
    try {
      await updatePointsMaster({ [key]: parsed }, user?.uid);
      setSuccessMessage("Points settings updated successfully.");
      setEditingKey(null);
      setDraftValue("");
    } catch (err) {
      setRowError(friendlyPointsSettingsError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-bg px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
          <Award size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-secondary">Points Master</h3>
          <p className="text-xs text-text-secondary">
            Configure the points awarded or deducted for member activities.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 border-b border-success-light bg-success-light px-5 py-2.5 text-sm text-success">
          <CheckCircle2 size={15} />
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="p-6 text-center text-sm text-text-secondary">Loading points settings...</div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-text-secondary">
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Points / Value</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {POINTS_MASTER_FIELDS.map(({ key, label }) => {
                const isEditing = editingKey === key;
                const value = values[key];

                return (
                  <tr key={key} className="border-b border-border transition-colors last:border-0 hover:bg-bg">
                    <td className="px-5 py-3 text-text">{label}</td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <div>
                          <input
                            type="number"
                            step="1"
                            autoFocus
                            value={draftValue}
                            onChange={(e) => setDraftValue(e.target.value)}
                            className="w-28 rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          {rowError && <p className="mt-1 text-xs text-danger">{rowError}</p>}
                        </div>
                      ) : (
                        <span
                          className={["tabular-nums font-medium", value < 0 ? "text-danger" : "text-text"].join(" ")}
                        >
                          {value.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => saveEdit(key)}
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
                          onClick={() => startEdit(key, value)}
                          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
