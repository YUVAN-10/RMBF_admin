import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

export default function MemberFilterSelect({ members, memberCounts, totalCount, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const filteredMembers = members.filter((m) =>
    m.fullName.toLowerCase().includes(query.trim().toLowerCase())
  );

  const selectedMember = value !== "all" ? members.find((m) => m.uid === value) : null;
  const selectedLabel =
    value === "all"
      ? `All Members (${totalCount})`
      : selectedMember
        ? `${selectedMember.fullName} (${memberCounts[selectedMember.uid] || 0})`
        : "All Members";

  const handleSelect = (uid) => {
    onChange(uid);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-w-[180px] items-center justify-between gap-2 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={15} className="shrink-0 text-text-secondary" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-64 rounded-lg border border-border bg-card shadow-lg animate-fade-in">
          <div className="relative border-b border-border p-2">
            <Search
              size={14}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search member..."
              className="w-full rounded-md border border-border bg-bg py-1.5 pl-7 pr-2 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="max-h-60 overflow-y-auto scrollbar-thin p-1">
            {query.trim() === "" && (
              <button
                type="button"
                onClick={() => handleSelect("all")}
                className={[
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-bg",
                  value === "all" ? "bg-primary-light text-primary" : "text-text",
                ].join(" ")}
              >
                <span>All Members</span>
                <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                  {totalCount}
                  {value === "all" && <Check size={14} className="text-primary" />}
                </span>
              </button>
            )}

            {filteredMembers.length === 0 ? (
              <p className="px-3 py-2 text-sm text-text-secondary">No members found</p>
            ) : (
              filteredMembers.map((m) => (
                <button
                  key={m.uid}
                  type="button"
                  onClick={() => handleSelect(m.uid)}
                  className={[
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-bg",
                    value === m.uid ? "bg-primary-light text-primary" : "text-text",
                  ].join(" ")}
                >
                  <span className="truncate">{m.fullName}</span>
                  <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                    {memberCounts[m.uid] || 0}
                    {value === m.uid && <Check size={14} className="text-primary" />}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
