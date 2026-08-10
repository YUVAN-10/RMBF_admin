import { Clock, CheckCircle2, EyeOff } from "lucide-react";
import { getDisplayStatus } from "../../utils/eventStatus";

const STYLES = {
  Upcoming: { classes: "bg-success-light text-success", icon: Clock },
  Completed: { classes: "bg-secondary/10 text-secondary", icon: CheckCircle2 },
  Inactive: { classes: "bg-border/70 text-text-secondary", icon: EyeOff },
};

export default function EventStatusBadge({ event }) {
  const label = getDisplayStatus(event);
  const { classes, icon: Icon } = STYLES[label];

  return (
    <span
      className={["inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", classes].join(
        " "
      )}
    >
      <Icon size={12} />
      {label}
    </span>
  );
}
