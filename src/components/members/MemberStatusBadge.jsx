export default function MemberStatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isActive ? "bg-success-light text-success" : "bg-border/60 text-text-secondary",
      ].join(" ")}
    >
      <span
        className={["h-1.5 w-1.5 rounded-full", isActive ? "bg-success" : "bg-text-secondary"].join(
          " "
        )}
      />
      {status}
    </span>
  );
}
