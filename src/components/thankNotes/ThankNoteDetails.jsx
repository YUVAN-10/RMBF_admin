import { formatCurrency } from "../../utils/formatCurrency";

export default function ThankNoteDetails({ note, onBack }) {
  if (!note) return null;

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text-secondary">Thank Note details</p>
          <h2 className="mt-1 text-xl font-semibold text-text">Read-only view</h2>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-primary-light"
        >
          Back
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border bg-bg p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">From</p>
          <p className="mt-2 text-lg font-semibold text-text">{note.fromName}</p>
        </div>
        <div className="rounded-2xl border border-border bg-bg p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">To</p>
          <p className="mt-2 text-lg font-semibold text-text">{note.toName}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-bg p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Message</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-text">“{note.message}”</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-bg p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Date</p>
          <p className="mt-2 text-sm text-text">{note.detailDate}</p>
        </div>
        <div className="rounded-2xl border border-border bg-bg p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Time</p>
          <p className="mt-2 text-sm text-text">{note.displayTime}</p>
        </div>
        <div className="rounded-2xl border border-border bg-bg p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Value</p>
          <p className="mt-2 text-sm font-semibold text-success">{formatCurrency(note.value)}</p>
        </div>
      </div>
    </div>
  );
}
