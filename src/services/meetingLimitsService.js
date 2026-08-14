import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { DEFAULT_POWER_TEAM_MEETINGS_PER_TERM } from "../utils/meetingTerm";

// Single source of truth for the Power Team Meetings per-term cap —
// settings/meetingLimits, always this one document ID.
const MEETING_LIMITS_REF = doc(db, "settings", "meetingLimits");

const DEFAULT_MEETING_LIMITS = {
  powerTeamMeetingsPerTerm: DEFAULT_POWER_TEAM_MEETINGS_PER_TERM,
};

export class MeetingLimitsError extends Error {}

function withDefaults(data) {
  return { ...DEFAULT_MEETING_LIMITS, ...data };
}

/** One-off read, merged over the defaults. Purely read-only — never creates the doc. */
export async function getMeetingLimits() {
  const snap = await getDoc(MEETING_LIMITS_REF);
  return withDefaults(snap.exists() ? snap.data() : {});
}

/** Real-time listener — lets the Settings card and meeting-creation checks both stay current. */
export function subscribeToMeetingLimits(onChange, onError) {
  return onSnapshot(
    MEETING_LIMITS_REF,
    (snap) => onChange(withDefaults(snap.exists() ? snap.data() : {}), snap.exists()),
    (error) => {
      console.error("Error fetching meeting limits:", error);
      onError?.(error);
    }
  );
}

/** First-time setup only — creates settings/meetingLimits with defaults if missing. Admin-only write. */
export async function ensureMeetingLimitsDoc(adminUid) {
  const snap = await getDoc(MEETING_LIMITS_REF);
  if (snap.exists()) return;

  await setDoc(MEETING_LIMITS_REF, {
    ...DEFAULT_MEETING_LIMITS,
    updatedAt: serverTimestamp(),
    updatedBy: adminUid || null,
  });
}

export async function updateMeetingLimits(values, adminUid) {
  if (!adminUid) throw new MeetingLimitsError("You must be signed in as an admin to update meeting limits.");

  const value = values.powerTeamMeetingsPerTerm;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new MeetingLimitsError("Power Team Meetings per term must be a valid number.");
  }
  if (!Number.isInteger(value)) {
    throw new MeetingLimitsError("Power Team Meetings per term must be a whole number.");
  }
  if (value <= 0) {
    throw new MeetingLimitsError("Power Team Meetings per term must be greater than 0.");
  }

  try {
    await setDoc(
      MEETING_LIMITS_REF,
      { ...values, updatedAt: serverTimestamp(), updatedBy: adminUid },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating meeting limits:", error);
    throw new MeetingLimitsError(friendlyMeetingLimitsError(error));
  }
}

export function friendlyMeetingLimitsError(error) {
  if (error instanceof MeetingLimitsError) return error.message;
  if (error?.code === "permission-denied") return "You don't have permission to update meeting limits.";
  if (error?.code === "unavailable") return "Network error. Please check your connection and try again.";
  return "Something went wrong. Please try again.";
}
