import ThankNoteRow from "./ThankNoteRow";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ThankNotesTable({ notes, startSerialNo, onViewNote }) {
  return (
    <div className="space-y-4">
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card shadow-sm md:block">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-bg text-left text-xs uppercase tracking-wide text-text-secondary">
              <th className="px-4 py-3 font-medium">S.No</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <ThankNoteRow
                key={note.id}
                note={note}
                serialNo={startSerialNo + index}
                onView={() => onViewNote(note)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {notes.map((note, index) => (
          <div
            key={note.id}
            onClick={() => onViewNote(note)}
            className="cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-bg"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{`#${startSerialNo + index}`}</p>
            <div className="mt-3 space-y-2 text-sm text-text-secondary">
              <div className="flex items-center gap-2 text-text">
                <span className="font-medium">From:</span>
                <span>{note.fromName}</span>
              </div>
              <div className="flex items-center gap-2 text-text">
                <span className="font-medium">To:</span>
                <span>{note.toName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text">Value:</span>
                <span className="font-medium text-success">{formatCurrency(note.value)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
