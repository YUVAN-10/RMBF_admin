import { useState } from "react";
import { Filter } from "lucide-react";

export default function AttendanceTable({ rows }) {
  const [filter, setFilter] = useState("All");

  const filteredRows = rows.filter((row) => {
    if (filter === "All") return true;
    return row.status === filter;
  });

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm animate-fade-in">
      <div className="flex items-center justify-between border-b border-border p-5">
        <h2 className="text-sm font-semibold text-secondary">Attendance List</h2>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-text-secondary" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Members</option>
            <option value="Present">Present</option>
            <option value="Permission">Permission</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-text-secondary">
              <th className="px-4 py-3 font-medium">S.No</th>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">RID No</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Attendance Status</th>
              <th className="px-4 py-3 font-medium">Scanned Date</th>
              <th className="px-4 py-3 font-medium">Scanned Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr key={row.uid} className="border-b border-border transition-colors last:border-0 hover:bg-bg">
                <td className="px-4 py-3 text-text-secondary">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-text">{row.name}</td>
                <td className="px-4 py-3 text-text-secondary">{row.ridNo}</td>
                <td className="px-4 py-3 text-text-secondary">{row.phone}</td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                      row.status === "Present"
                        ? "bg-success-light text-success"
                        : row.status === "Permission"
                        ? "bg-warning-light text-warning"
                        : "bg-danger-light text-danger",
                    ].join(" ")}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary">{row.scannedDate || "—"}</td>
                <td className="px-4 py-3 tabular-nums text-text-secondary">{row.scannedTime || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
