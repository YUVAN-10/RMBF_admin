import { CheckCircle2, Clock } from "lucide-react";

function StatusBadge({ status }) {
  const isCompleted = status === "Completed";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isCompleted ? "bg-success-light text-success" : "bg-primary-light text-primary",
      ].join(" ")}
    >
      {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
      {status}
    </span>
  );
}

export default function RecentMeetings({ meetings }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-secondary">Recent Meetings</h2>
          <p className="text-sm text-text-secondary">Latest and upcoming meeting schedule</p>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
              <th className="py-2.5 pr-4 font-medium">Meeting Name</th>
              <th className="py-2.5 pr-4 font-medium">Date</th>
              <th className="py-2.5 pr-4 font-medium">Time</th>
              <th className="py-2.5 pr-4 font-medium">Place</th>
              <th className="py-2.5 pr-4 font-medium">Attendance</th>
              <th className="py-2.5 pr-0 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting) => (
              <tr
                key={meeting.id}
                className="border-b border-border last:border-0 transition-colors hover:bg-bg"
              >
                <td className="py-3 pr-4 font-medium text-text">{meeting.name}</td>
                <td className="py-3 pr-4 text-text-secondary">{meeting.date}</td>
                <td className="py-3 pr-4 text-text-secondary">{meeting.time}</td>
                <td className="py-3 pr-4 text-text-secondary">{meeting.place}</td>
                <td className="py-3 pr-4 tabular-nums text-text-secondary">{meeting.attendance}</td>
                <td className="py-3 pr-0">
                  <StatusBadge status={meeting.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
