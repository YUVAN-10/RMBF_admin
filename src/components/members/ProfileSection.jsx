export function ProfileSection({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
      <div className="mb-4 flex items-center gap-2">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
            <Icon size={16} />
          </div>
        )}
        <h2 className="text-sm font-semibold text-secondary">{title}</h2>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">{children}</dl>
    </div>
  );
}

export function ProfileField({ label, value, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <dt className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</dt>
      <dd className="mt-1 text-sm text-text break-words">{value || "—"}</dd>
    </div>
  );
}
