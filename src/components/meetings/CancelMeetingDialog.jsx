export default function CancelMeetingDialog({ open, onDismiss, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-secondary/40 backdrop-blur-[1px]" onClick={onDismiss} />
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg animate-fade-in">
        <h2 className="text-base font-semibold text-text">Cancel Meeting</h2>
        <p className="mt-2 text-sm text-text-secondary">Are you sure you want to cancel this meeting?</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger/90"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
}
