import { useState } from "react";
import { Search, X, Check } from "lucide-react";
import MemberAvatar from "../members/MemberAvatar";

export default function PowerTeamMemberPicker({ members, selectedIds, onChange, powerTeamName }) {
  const [query, setQuery] = useState("");

  const teamMembers = members.filter(
    (m) => (m.status || "").toLowerCase() === "active" && m.powerTeam === powerTeamName
  );
  const q = query.trim().toLowerCase();
  const filteredMembers = teamMembers.filter(
    (m) => m.fullName.toLowerCase().includes(q) || (m.ridNo || "").toLowerCase().includes(q)
  );

  const selectedSet = new Set(selectedIds);

  const toggle = (uid) => {
    if (selectedSet.has(uid)) {
      onChange(selectedIds.filter((id) => id !== uid));
    } else {
      onChange([...selectedIds, uid]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="mb-1.5 text-sm font-medium text-text">Eligible Members</p>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="mb-1.5 flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-danger"
          >
            <X size={12} />
            Clear ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-bg">
        <div className="relative border-b border-border p-2">
          <Search
            size={14}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search member by name or RID..."
            className="w-full rounded-md border border-border bg-card py-1.5 pl-7 pr-2 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="max-h-60 overflow-y-auto scrollbar-thin p-1">
          {!powerTeamName ? (
            <p className="px-3 py-4 text-center text-sm text-text-secondary">Select a Power Team first</p>
          ) : filteredMembers.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-text-secondary">No members found</p>
          ) : (
            filteredMembers.map((m) => {
              const isSelected = selectedSet.has(m.uid);
              return (
                <button
                  key={m.uid}
                  type="button"
                  onClick={() => toggle(m.uid)}
                  className={[
                    "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-card",
                    isSelected ? "bg-primary-light" : "",
                  ].join(" ")}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <MemberAvatar name={m.fullName} image={m.profileImage} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-text">{m.fullName}</span>
                      <span className="block text-xs text-text-secondary">RID: {m.ridNo || "—"}</span>
                    </span>
                  </span>
                  <span
                    className={[
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      isSelected ? "border-primary bg-primary text-white" : "border-border bg-card",
                    ].join(" ")}
                  >
                    {isSelected && <Check size={13} />}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <p className="mt-1.5 text-xs text-text-secondary">
        {!powerTeamName
          ? "Choose a Power Team above to see its members."
          : `${selectedIds.length} of ${teamMembers.length} team member${teamMembers.length === 1 ? "" : "s"} eligible for attendance.`}
      </p>
    </div>
  );
}
