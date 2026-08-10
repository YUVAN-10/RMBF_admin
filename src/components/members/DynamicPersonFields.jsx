import { Plus, X } from "lucide-react";
import { createEmptyChild } from "../../data/membersData";

const inputClasses =
  "w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export default function DynamicPersonFields({ label, addLabel, items, onChange }) {
  const updateItem = (index, field, value) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => onChange([...items, createEmptyChild()]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="sm:col-span-2">
      {items.length > 0 && (
        <div className="mb-1.5 hidden grid-cols-[1fr_1fr_1fr_1fr_2.25rem] gap-3 text-xs font-medium uppercase tracking-wide text-text-secondary sm:grid">
          <span>{label} Name</span>
          <span>DOB</span>
          <span>Blood</span>
          <span>Qualification</span>
          <span />
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr_2.25rem] sm:items-center"
          >
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              placeholder={`${label} Name`}
              className={inputClasses}
            />
            <input
              type="date"
              value={item.dob}
              onChange={(e) => updateItem(index, "dob", e.target.value)}
              className={inputClasses}
            />
            <input
              type="text"
              value={item.blood}
              onChange={(e) => updateItem(index, "blood", e.target.value)}
              placeholder="Blood"
              className={inputClasses}
            />
            <input
              type="text"
              value={item.qualification}
              onChange={(e) => updateItem(index, "qualification", e.target.value)}
              placeholder="Qualification"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="flex h-9 w-9 items-center justify-center justify-self-start rounded-lg text-text-secondary transition-colors hover:bg-danger-light hover:text-danger sm:justify-self-center"
              aria-label={`Remove ${label.toLowerCase()}`}
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
