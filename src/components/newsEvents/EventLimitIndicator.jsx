export default function EventLimitIndicator({ activeCount, max }) {
  const atLimit = activeCount >= max;

  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
      <span
        className={[
          "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm",
          atLimit ? "border-accent bg-accent/10 text-secondary" : "border-border bg-card text-text-secondary",
        ].join(" ")}
      >
        Active Events:{" "}
        <span className="font-semibold text-text">
          {activeCount} / {max}
        </span>
      </span>
      {atLimit && <span className="text-xs font-medium text-danger">Maximum 5 active events allowed.</span>}
    </div>
  );
}
