import { useEffect, useState } from "react";
import { CalendarRange } from "lucide-react";
import { useTerms } from "../../context/TermsContext";
import TermSelector from "../terms/TermSelector";
import { formatTermLabel } from "../../utils/termPeriod";
import { formatDate } from "../../utils/formatDate";

export default function TermCard() {
  const { terms, activeTerm, loading } = useTerms();
  const [viewingTermNumber, setViewingTermNumber] = useState(null);

  useEffect(() => {
    if (activeTerm && viewingTermNumber === null) {
      setViewingTermNumber(activeTerm.termNumber);
    }
  }, [activeTerm, viewingTermNumber]);

  const viewingTerm = terms.find((t) => t.termNumber === viewingTermNumber) || activeTerm;
  const isViewingActive = viewingTerm && activeTerm && viewingTerm.termNumber === activeTerm.termNumber;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-bg px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
          <CalendarRange size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-secondary">Term Management</h3>
          <p className="text-xs text-text-secondary">
            Terms run in fixed 6-month cycles and are tracked automatically — the period is never editable.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center text-sm text-text-secondary">Loading terms...</div>
      ) : !activeTerm ? (
        <div className="p-6 text-center text-sm text-text-secondary">Setting up the first term...</div>
      ) : (
        <div className="p-5 space-y-5">
          <div className="rounded-lg border border-border bg-bg p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Current Active Term</p>
            <p className="mt-1 text-lg font-semibold text-text">{formatTermLabel(activeTerm)}</p>
            <p className="mt-1 text-xs text-text-secondary">Started {formatDate(activeTerm.startDate)}</p>
          </div>

          {terms.length > 1 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
                Browse Term History
              </p>
              <TermSelector terms={terms} value={viewingTerm?.termNumber} onChange={setViewingTermNumber} />

              {viewingTerm && !isViewingActive && (
                <div className="mt-3 rounded-lg border border-border bg-bg p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                    Viewing {formatTermLabel(viewingTerm)}
                  </p>
                  <p className="mt-1 text-sm text-text">
                    {formatDate(viewingTerm.startDate)} – {formatDate(viewingTerm.endDate)}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-bg px-2.5 py-1 text-xs font-medium text-text-secondary">
                    Completed
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
