export default function PlaceholderPage({ icon: Icon, title, description }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-secondary">{title}</h1>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>

      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center animate-fade-in">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
          <Icon size={26} />
        </div>
        <h2 className="mt-4 text-base font-semibold text-text">{title} module coming soon</h2>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">
          This section will be built out next and connected to live data.
        </p>
      </div>
    </div>
  );
}
