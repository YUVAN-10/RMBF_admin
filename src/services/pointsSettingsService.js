import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { DEFAULT_POINTS_MASTER, POINTS_MASTER_FIELDS } from "../data/pointsMasterData";

// Single source of truth for every point value used across the app —
// settings/pointsMaster, always this one document ID, never duplicated.
const POINTS_MASTER_REF = doc(db, "settings", "pointsMaster");

export class PointsSettingsError extends Error {}

function withDefaults(data) {
  return { ...DEFAULT_POINTS_MASTER, ...data };
}

/** One-off read, merged over the defaults. Purely read-only — never creates the doc. */
export async function getPointsMaster() {
  const snap = await getDoc(POINTS_MASTER_REF);
  return withDefaults(snap.exists() ? snap.data() : {});
}

/** Real-time listener — the User App and Admin Settings card should both use this. */
export function subscribeToPointsMaster(onChange, onError) {
  return onSnapshot(
    POINTS_MASTER_REF,
    (snap) => onChange(withDefaults(snap.exists() ? snap.data() : {}), snap.exists()),
    (error) => {
      console.error("Error fetching points master:", error);
      onError?.(error);
    }
  );
}

/**
 * First-time setup only: creates settings/pointsMaster with the default
 * values if it doesn't exist yet. Only ever called from the admin Settings
 * page (write access is admin-only per firestore.rules), never from a
 * member-facing read path.
 */
export async function ensurePointsMasterDoc(adminUid) {
  const snap = await getDoc(POINTS_MASTER_REF);
  if (snap.exists()) return;

  await setDoc(POINTS_MASTER_REF, {
    ...DEFAULT_POINTS_MASTER,
    updatedAt: serverTimestamp(),
    updatedBy: adminUid || null,
  });
}

function validatePointsMasterValues(values) {
  for (const { key, label } of POINTS_MASTER_FIELDS) {
    const value = values[key];
    if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
      throw new PointsSettingsError(`${label} must be a valid number.`);
    }
    if (!Number.isInteger(value)) {
      throw new PointsSettingsError(`${label} must be a whole number.`);
    }
  }
  if (values.monthlyPointLimit <= 0) {
    throw new PointsSettingsError("Monthly point limit must be greater than 0.");
  }
}

/**
 * Updates one or more point values. Validates every field present in
 * `values` (numeric, integer, monthly limit > 0), then merges the change
 * into settings/pointsMaster along with a fresh serverTimestamp and the
 * acting admin's UID.
 */
export async function updatePointsMaster(values, adminUid) {
  if (!adminUid) throw new PointsSettingsError("You must be signed in as an admin to update points settings.");

  const current = await getPointsMaster();
  const merged = { ...current, ...values };
  validatePointsMasterValues(merged);

  try {
    await setDoc(
      POINTS_MASTER_REF,
      {
        ...values,
        updatedAt: serverTimestamp(),
        updatedBy: adminUid,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating points master:", error);
    throw new PointsSettingsError(friendlyPointsSettingsError(error));
  }
}

export function friendlyPointsSettingsError(error) {
  if (error instanceof PointsSettingsError) return error.message;
  if (error?.code === "permission-denied") return "You don't have permission to update points settings.";
  if (error?.code === "unavailable") return "Network error. Please check your connection and try again.";
  return "Something went wrong. Please try again.";
}
