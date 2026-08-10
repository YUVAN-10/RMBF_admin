export default function AttendanceOverview({ total, present, permission, absent, rate }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
      <h2 className="mb-4 text-sm font-semibold text-secondary">Attendance Overview</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Total</p>
          <p className="mt-1 text-2xl font-semibold text-text">{total}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Present</p>
          <p className="mt-1 text-2xl font-semibold text-success">{present}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Permission</p>
          <p className="mt-1 text-2xl font-semibold text-warning">{permission}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Absent</p>
          <p className="mt-1 text-2xl font-semibold text-danger">{absent}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Attendance Rate</span>
          <span className="font-medium text-text">{rate}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-bg">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
