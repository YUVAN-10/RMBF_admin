export default function ThankNotesEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
      <p className="text-lg font-semibold text-text">No Thank Notes yet</p>
      <p className="mt-2 max-w-md mx-auto text-sm text-text-secondary">
        Thank Notes created by members will appear here.
      </p>
    </div>
  );
}
