import { Plus, X } from "lucide-react";
import { createEmptyChild } from "../../data/membersData";

const inputClasses =
  "w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export default function DynamicPersonFields({ label, addLabel, items = [], onChange }) {
  const safeItems = Array.isArray(items) ? items : [];

  const updateItem = (index, field, value) => {
    onChange(safeItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => onChange([...safeItems, createEmptyChild()]);
  const removeItem = (index) => onChange(safeItems.filter((_, i) => i !== index));

  return (
    <div className="sm:col-span-2">
      {safeItems.length > 0 && (
        <div className="mb-1.5 hidden grid-cols-[1fr_1fr_1fr_1fr_2.25rem] gap-3 text-xs font-medium uppercase tracking-wide text-text-secondary sm:grid">
          <span>{label} Name</span>
          <span>DOB</span>
          <span>Blood</span>
          <span>Qualification</span>
          <span />
        </div>
      )}

      <div className="space-y-4 sm:space-y-3">
        {safeItems.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/60 bg-bg/60 p-3.5 sm:border-0 sm:bg-transparent sm:p-0 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr_2.25rem] sm:items-center"
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary sm:hidden">{label} Name</label>
              <input
                type="text"
                value={item?.name || ""}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                placeholder={`${label} Name`}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary sm:hidden">Date of Birth</label>
              <input
                type="date"
                value={item?.dob || ""}
                onChange={(e) => updateItem(index, "dob", e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary sm:hidden">Blood Group</label>
              <input
                type="text"
                value={item?.blood || ""}
                onChange={(e) => updateItem(index, "blood", e.target.value)}
                placeholder="Blood Group"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary sm:hidden">Qualification</label>
              <input
                type="text"
                value={item?.qualification || ""}
                onChange={(e) => updateItem(index, "qualification", e.target.value)}
                placeholder="Qualification"
                className={inputClasses}
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="flex h-9 w-9 items-center justify-center justify-self-start rounded-lg text-text-secondary transition-colors hover:bg-danger-light hover:text-danger sm:justify-self-center"
              aria-label={`Remove ${(label || "").toLowerCase()}`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-3 flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary-light"
      >
        <Plus size={14} />
        {addLabel}
      </button>
    </div>
  );
}
