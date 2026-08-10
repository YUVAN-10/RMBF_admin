export default function AttendanceTable({ rows }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm animate-fade-in">
      <div className="border-b border-border p-5">
        <h2 className="text-sm font-semibold text-secondary">Attendance List</h2>
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
            {rows.map((row, index) => (
              <tr key={row.uid} className="border-b border-border transition-colors last:border-0 hover:bg-bg">
                <td className="px-4 py-3 text-text-secondary">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-text">{row.name}</td>
                <td className="px-4 py-3 text-text-secondary">{row.ridNo}</td>
                <td className="px-4 py-3 text-text-secondary">{row.phone}</td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                      row.present ? "bg-success-light text-success" : "bg-danger-light text-danger",
                    ].join(" ")}
                  >
                    {row.present ? "Present" : "Absent"}
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
