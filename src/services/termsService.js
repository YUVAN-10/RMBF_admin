import {
  doc,
  collection,
  getDoc,
  setDoc,
  onSnapshot,
  runTransaction,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getTermPeriod, getTermEndDate, getNextTermStart } from "../utils/termPeriod";

export class TermsError extends Error {}

const TERMS_COLLECTION = "terms";
const INITIAL_TERM_NUMBER = 13;
const INITIAL_TERM_START = new Date(2026, 6, 1); // July 1, 2026

function buildTermDoc(termNumber, startDate, { status, createdBy }) {
  const { period, periodStartMonth, periodEndMonth } = getTermPeriod(termNumber);
  return {
    termNumber,
    termName: `Term ${termNumber}`,
    period,
    periodStartMonth,
    periodEndMonth,
    status,
    startDate: Timestamp.fromDate(startDate),
    endDate: null,
    createdAt: serverTimestamp(),
    createdBy: createdBy || null,
  };
}

/** Real-time listener over every term, newest first. */
export function subscribeToTerms(onChange, onError) {
  const termsQuery = query(collection(db, TERMS_COLLECTION), orderBy("termNumber", "desc"));

  return onSnapshot(
    termsQuery,
    (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() }));
      onChange(items);
    },
    (error) => {
      console.error("Error fetching terms:", error);
      onError?.(error);
    }
  );
}

/** First-time setup only — seeds Term 13 if the terms collection is empty. */
export async function ensureInitialTerm(adminUid) {
  const ref = doc(db, TERMS_COLLECTION, String(INITIAL_TERM_NUMBER));
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  await setDoc(ref, buildTermDoc(INITIAL_TERM_NUMBER, INITIAL_TERM_START, { status: "active", createdBy: adminUid }));
}

/**
 * Rolls the active term forward to the next one once its 6-month period has
 * ended. Deterministic doc IDs (termNumber+1) make this idempotent — safe to
 * call from every admin session on every app load with no coordination.
 */
export async function advanceTermIfNeeded(activeTerm, adminUid) {
  if (!activeTerm) return false;

  const endDate = getTermEndDate(activeTerm);
  if (new Date() <= endDate) return false;

  const nextNumber = activeTerm.termNumber + 1;
  const nextStart = getNextTermStart(activeTerm);
  const currentRef = doc(db, TERMS_COLLECTION, String(activeTerm.termNumber));
  const nextRef = doc(db, TERMS_COLLECTION, String(nextNumber));

  try {
    await runTransaction(db, async (tx) => {
      const currentSnap = await tx.get(currentRef);
      if (!currentSnap.exists() || currentSnap.data().status !== "active") return;

      tx.update(currentRef, { status: "completed", endDate: Timestamp.fromDate(endDate) });
      tx.set(nextRef, buildTermDoc(nextNumber, nextStart, { status: "active", createdBy: adminUid }));
    });
  } catch (error) {
    console.error("Error advancing term:", error);
    throw new TermsError(friendlyTermsError(error));
  }

  return true;
}

export function friendlyTermsError(error) {
  if (error instanceof TermsError) return error.message;
  if (error?.code === "permission-denied") return "You don't have permission to manage terms.";
  if (error?.code === "unavailable") return "Network error. Please check your connection and try again.";
  return "Something went wrong. Please try again.";
}
