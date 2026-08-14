// Terms are numbered sequentially and never reset — Term 13, 14, 15, ... —
// each exactly 6 months, alternating July-December (odd) / January-June
// (even). The period is always derived from the term number, never
// hand-entered (see termsService.js for where these are written to
// Firestore).

function toDate(value) {
  if (!value) return new Date();
  if (typeof value.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

/** The one place the odd/even -> period rule lives. Never hardcode individual term numbers. */
export function getTermPeriod(termNumber) {
  const isOdd = termNumber % 2 === 1;
  return isOdd
    ? { period: "July - December", periodStartMonth: 7, periodEndMonth: 12 }
    : { period: "January - June", periodStartMonth: 1, periodEndMonth: 6 };
}

/** "Term 13 • July - December" */
export function formatTermLabel(term) {
  if (!term) return "";
  return `Term ${term.termNumber} • ${term.period}`;
}

/** Last calendar day of a term's periodEndMonth, in its startDate's year. */
export function getTermEndDate(term) {
  const start = toDate(term.startDate);
  return new Date(start.getFullYear(), term.periodEndMonth, 0);
}

/** The day after a term ends — where the next term starts. */
export function getNextTermStart(term) {
  const end = getTermEndDate(term);
  const next = new Date(end);
  next.setDate(next.getDate() + 1);
  return next;
}

/** Every "YYYY-MM" month id inside a term's 6-month window, ascending (start -> end). */
export function getMonthsInTerm(term) {
  if (!term) return [];
  const year = toDate(term.startDate).getFullYear();
  const months = [];
  for (let m = term.periodStartMonth; m <= term.periodEndMonth; m++) {
    months.push(`${year}-${String(m).padStart(2, "0")}`);
  }
  return months;
}
