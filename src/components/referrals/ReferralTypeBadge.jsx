import { UserCheck, Users } from "lucide-react";

export default function ReferralTypeBadge({ type }) {
  const isConnect = type === "connect";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isConnect ? "bg-secondary/10 text-secondary" : "bg-primary-light text-primary",
      ].join(" ")}
    >
      {isConnect ? <Users size={12} /> : <UserCheck size={12} />}
      {isConnect ? "Connect" : "Self Referral"}
    </span>
  );
}
