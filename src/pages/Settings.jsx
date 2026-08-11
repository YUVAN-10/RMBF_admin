import { useState } from "react";
import { Settings as SettingsIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { useMasters } from "../context/MastersContext";

function MasterList({ title, items, category, onAdd, onRemove }) {
  const [newValue, setNewValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newValue.trim() && !items.includes(newValue.trim())) {
      setIsSubmitting(true);
      try {
        await onAdd(category, newValue.trim());
        setNewValue("");
      } catch (err) {
        console.error("Failed to add master item:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-bg px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-secondary">{title}</h3>
      </div>
      
      <div className="p-4 flex-1 flex flex-col gap-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Add new ${title.toLowerCase()}`}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newValue.trim() || isSubmitting}
            className="flex shrink-0 items-center justify-center rounded-lg bg-primary px-3 py-2 text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          </button>
        </form>

        <div className="flex-1 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="text-sm text-text-secondary text-center py-4">No items found</div>
          ) : (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex items-center justify-between rounded-lg border border-border/50 bg-bg px-3 py-2.5 group">
                  <span className="text-sm text-text">{item}</span>
                  <button
                    onClick={() => onRemove(category, item)}
                    className="text-text-secondary hover:text-danger opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { masters, addMasterItem, removeMasterItem } = useMasters();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
          <SettingsIcon size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-secondary">Master Settings</h1>
          <p className="text-sm text-text-secondary">
            Manage dropdown options for member roles and designations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[400px] md:h-[600px]">
        <MasterList 
          title="Positions" 
          items={masters.positions} 
          category="positions"
          onAdd={addMasterItem}
          onRemove={removeMasterItem}
        />
        <MasterList 
          title="Directors" 
          items={masters.directors} 
          category="directors"
          onAdd={addMasterItem}
          onRemove={removeMasterItem}
        />
        <MasterList 
          title="Coordinators" 
          items={masters.coordinators} 
          category="coordinators"
          onAdd={addMasterItem}
          onRemove={removeMasterItem}
        />
      </div>
    </div>
  );
}
