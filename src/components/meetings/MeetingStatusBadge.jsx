import { Clock, Zap, CheckCircle2, XCircle } from "lucide-react";
import { computeMeetingStatus, statusLabels } from "../../utils/meetingStatus";

const STYLES = {
  upcoming: { classes: "bg-primary-light text-primary", icon: Clock },
  ongoing: { classes: "bg-accent/20 text-secondary", icon: Zap },
  completed: { classes: "bg-success-light text-success", icon: CheckCircle2 },
  cancelled: { classes: "bg-danger-light text-danger", icon: XCircle },
};

export default function MeetingStatusBadge({ meeting }) {
  const status = computeMeetingStatus(meeting);
  const { classes, icon: Icon } = STYLES[status];

  return (
    <span
      className={["inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", classes].join(
        " "
      )}
    >
      <Icon size={12} />
      {statusLabels[status]}
    </span>
  );
}
