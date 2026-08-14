import {
  doc,
  collection,
  collectionGroup,
  getDoc,
  getDocs,
  onSnapshot,
  runTransaction,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { getCurrentMonthId, MONTHLY_POINT_LIMIT } from "../utils/pointsMonth";
import { getPointsMaster } from "./pointsSettingsService";

// Thrown for expected, user-facing failures (bad input, not found, not
// signed in). Kept separate from raw Firebase errors so callers never have
// to show a raw error code.
export class PointsError extends Error {}

/**
 * Adds (or, with a negative amount, deducts) points for a member for a
 * given activity, keeping the running monthly total within
 * [0, maxPoints]. Runs as an atomic Firestore transaction so concurrent
 * awards can never read a stale point total or push a member out of range.
 *
 * @param {string} userUid - the member being awarded points (members/{userUid} must exist)
 * @param {number} pointsToAdd - non-zero whole number; positive to award, negative to deduct
 * @param {string} activityType - e.g. "r_to_r", "power_team_attendance", "referral_count", "absent"
 * @param {{ referenceId?: string, description?: string }} [options] - referenceId makes the change
 *   idempotent: the same activityType+referenceId can never be applied twice.
 * @returns {Promise<{ success: boolean, awardedPoints: number, totalPoints: number, remainingPoints: number, message?: string }>}
 */
export async function awardPoints(userUid, pointsToAdd, activityType, options = {}) {
  const { referenceId, description } = options;

  if (!userUid) throw new PointsError("A target member is required.");
  if (!Number.isFinite(pointsToAdd) || pointsToAdd === 0) {
    throw new PointsError("Points to add must be a non-zero number.");
  }
  if (!activityType) throw new PointsError("An activity type is required.");

  // 1. Verify the authenticated actor.
  const actorUid = auth.currentUser?.uid;
  if (!actorUid) throw new PointsError("You must be signed in to award points.");

  // 2. Verify the target member exists — never trust a bare UID from the client.
  const memberSnap = await getDoc(doc(db, "members", userUid));
  if (!memberSnap.exists()) throw new PointsError("Target member could not be found.");

  // The Points Master's monthlyPointLimit is the default cap for a member's
  // month doc the first time it's created — settings/pointsMaster is the
  // single source of truth, never a hardcoded value (falls back to the
  // static constant only if the settings doc is somehow unreachable).
  let defaultMaxPoints = MONTHLY_POINT_LIMIT;
  try {
    const master = await getPointsMaster();
    defaultMaxPoints = master.monthlyPointLimit;
  } catch {
    // Fall back silently — an unreachable settings doc shouldn't block awarding.
  }

  // 3-4. Current calendar month drives which monthly document is touched.
  const month = getCurrentMonthId();
  const monthRef = doc(db, "memberPoints", userUid, "months", month);

  // A deterministic transaction doc ID (activityType + referenceId) makes a
  // repeat award for the same one-time activity a no-op — same pattern used
  // for duplicate-prevention in referralService.js and the meeting
  // attendance subcollection.
  const transactionRef = referenceId
    ? doc(db, "memberPoints", userUid, "months", month, "transactions", `${activityType}_${referenceId}`)
    : doc(collection(db, "memberPoints", userUid, "months", month, "transactions"));

  try {
    const outcome = await runTransaction(db, async (tx) => {
      if (referenceId) {
        const existingTxn = await tx.get(transactionRef);
        if (existingTxn.exists()) {
          return { duplicate: true };
        }
      }

      const monthSnap = await tx.get(monthRef);
      const currentPoints = monthSnap.exists() ? monthSnap.data().points || 0 : 0;
      const maxPoints = monthSnap.exists() ? monthSnap.data().maxPoints || defaultMaxPoints : defaultMaxPoints;

      // 7-9. Cap the change so points can never leave [0, maxPoints].
      let awardedPoints;
      if (pointsToAdd > 0) {
        const remainingBefore = Math.max(0, maxPoints - currentPoints);
        awardedPoints = Math.min(pointsToAdd, remainingBefore);
      } else {
        const deductibleBefore = Math.max(0, currentPoints);
        awardedPoints = -Math.min(-pointsToAdd, deductibleBefore);
      }
      const totalPoints = currentPoints + awardedPoints;

      tx.set(
        monthRef,
        {
          memberUid: userUid,
          points: totalPoints,
          maxPoints,
          month,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (awardedPoints !== 0) {
        tx.set(transactionRef, {
          points: awardedPoints,
          activityType,
          referenceId: referenceId || null,
          description: description || "",
          createdAt: serverTimestamp(),
        });
      }

      return { awardedPoints, totalPoints, remainingPoints: maxPoints - totalPoints };
    });

    if (outcome.duplicate) {
      return { success: false, awardedPoints: 0, message: "Points have already been awarded for this activity." };
    }

    if (outcome.awardedPoints === 0) {
      const message = pointsToAdd > 0 ? "Monthly point limit reached." : "Points are already at the minimum (0).";
      return { ...outcome, success: false, message };
    }

    return { ...outcome, success: true };
  } catch (error) {
    if (error instanceof PointsError) throw error;
    console.error("Error awarding points:", error);
    throw new PointsError(friendlyPointsError(error));
  }
}

const ACTIVITY_MASTER_KEYS = {
  r_to_r: "rToRPoints",
  power_team_attendance: "powerTeamAttendancePoints",
  absent: "absentPoints",
  attendance_present: "attendancePresentPoints",
  leave: "leavePoints",
  absent_alternate: "absentAlternatePoints",
  early_going_late: "earlyGoingLatePoints",
  referral_count: "referralCountPoints",
  visitors: "visitorsCountPoints",
};

/**
 * Looks up the current, admin-configured point value for an activity type
 * from the Points Master — callers should never hardcode a point value.
 * "referral_value" is the one activity that isn't a flat per-occurrence
 * value: it depends on a rupee amount (options.amount), computed as
 * floor(amount / 1000) * referralValuePer1000.
 */
export function getActivityPoints(activityType, master, options = {}) {
  if (activityType === "referral_value") {
    const amount = Number(options.amount) || 0;
    return Math.floor(amount / 1000) * master.referralValuePer1000;
  }
  const masterKey = ACTIVITY_MASTER_KEYS[activityType];
  if (!masterKey) throw new PointsError(`Unknown activity type: ${activityType}`);
  return master[masterKey];
}

/**
 * Recommended entry point for the User App: awards/deducts points for
 * `activityType` using whatever the Points Master currently says, instead
 * of the caller having to know/hardcode a point value.
 */
export async function awardPointsForActivity(userUid, activityType, options = {}) {
  const master = await getPointsMaster();
  const points = getActivityPoints(activityType, master, options);

  if (points === 0) {
    return { success: false, awardedPoints: 0, message: "This activity is currently worth 0 points." };
  }

  return awardPoints(userUid, points, activityType, options);
}

/** The member's stored, already-awarded monthly total (memberPoints/{uid}/months/{month}). */
export async function getMemberMonthlyPoints(memberUid, month) {
  const snap = await getDoc(doc(db, "memberPoints", memberUid, "months", month));
  if (snap.exists()) {
    const data = snap.data();
    return { points: data.points || 0, maxPoints: data.maxPoints || MONTHLY_POINT_LIMIT, month };
  }
  const master = await getPointsMaster();
  return { points: 0, maxPoints: master.monthlyPointLimit, month };
}

function isInMonth(value, monthId) {
  if (!value) return false;
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const id = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  return id === monthId;
}

/**
 * Dynamically recalculates a member's points for a month straight from the
 * underlying activity collections, using the CURRENT Points Master values —
 * so changing a master value changes this result immediately, with no
 * stale per-activity point value stored anywhere. This is a live
 * calculation (not the stored memberPoints/{uid}/months/{month} total from
 * awardPoints()); the two are intentionally separate views.
 *
 * Some Points Master categories (Visitors, Leave, Attendance
 * Present/Absent/Absent-Alternate/Early-Going-Late, Referral Value) have no
 * source collection in this project yet, so they're returned with
 * `available: false` and `points: 0` rather than a fabricated number.
 */
export async function calculateMemberPoints(memberUid, month) {
  if (!memberUid) throw new PointsError("A member is required.");
  if (!month) throw new PointsError("A month is required.");

  const master = await getPointsMaster();

  const [rToRSnap, referralsSnap, attendanceSnap] = await Promise.all([
    getDocs(collection(db, "rToR")),
    getDocs(collection(db, "referrals")),
    getDocs(collectionGroup(db, "attendance")),
  ]);

  const rToRCount = rToRSnap.docs.filter((docSnap) => {
    const data = docSnap.data();
    const fromUid = data.fromMemberUid || data.fromUserId || data.fromMemberId || "";
    return fromUid === memberUid && isInMonth(data.createdAt, month);
  }).length;

  const referralCount = referralsSnap.docs.filter((docSnap) => {
    const data = docSnap.data();
    return data.referrerId === memberUid && isInMonth(data.createdAt, month);
  }).length;

  // collectionGroup("attendance") also matches meetings/{id}/attendance —
  // filter to only powerTeamMeetings/{id}/attendance/{uid} docs.
  const powerTeamAttendanceCount = attendanceSnap.docs.filter((docSnap) => {
    const grandparentId = docSnap.ref.parent.parent?.parent?.id;
    if (grandparentId !== "powerTeamMeetings") return false;
    const data = docSnap.data();
    return data.userUid === memberUid && typeof data.meetingDate === "string" && data.meetingDate.startsWith(month);
  }).length;

  const breakdown = [
    {
      key: "rToR",
      label: "R to R",
      count: rToRCount,
      unitPoints: master.rToRPoints,
      points: rToRCount * master.rToRPoints,
      available: true,
    },
    {
      key: "powerTeamAttendance",
      label: "Power Team Attendance",
      count: powerTeamAttendanceCount,
      unitPoints: master.powerTeamAttendancePoints,
      points: powerTeamAttendanceCount * master.powerTeamAttendancePoints,
      available: true,
    },
    {
      key: "referralCount",
      label: "Referral Count",
      count: referralCount,
      unitPoints: master.referralCountPoints,
      points: referralCount * master.referralCountPoints,
      available: true,
    },
    {
      key: "referralValue",
      label: "Referral Value for each ₹1000",
      count: 0,
      unitPoints: master.referralValuePer1000,
      points: 0,
      available: false,
      note: "referrals/{id} has no monetary amount field yet, so there is nothing to calculate against.",
    },
    {
      key: "attendancePresent",
      label: "Attendance - Present",
      count: 0,
      unitPoints: master.attendancePresentPoints,
      points: 0,
      available: false,
      note: "No general daily attendance collection exists in this project yet.",
    },
    {
      key: "absent",
      label: "Absent",
      count: 0,
      unitPoints: master.absentPoints,
      points: 0,
      available: false,
      note: "No leave/attendance collection exists in this project yet.",
    },
    {
      key: "absentAlternate",
      label: "Absent - Alternate",
      count: 0,
      unitPoints: master.absentAlternatePoints,
      points: 0,
      available: false,
      note: "No leave/attendance collection exists in this project yet.",
    },
    {
      key: "leave",
      label: "Leave",
      count: 0,
      unitPoints: master.leavePoints,
      points: 0,
      available: false,
      note: "No leave collection exists in this project yet.",
    },
    {
      key: "earlyGoingLate",
      label: "Early Going / Late",
      count: 0,
      unitPoints: master.earlyGoingLatePoints,
      points: 0,
      available: false,
      note: "No attendance collection exists in this project yet.",
    },
    {
      key: "visitors",
      label: "Visitors Count",
      count: 0,
      unitPoints: master.visitorsCountPoints,
      points: 0,
      available: false,
      note: "No visitors collection exists in this project yet.",
    },
  ];

  const rawTotal = breakdown.reduce((sum, item) => sum + item.points, 0);
  const monthlyLimit = master.monthlyPointLimit;
  const totalPoints = Math.min(monthlyLimit, Math.max(0, rawTotal));

  return {
    memberUid,
    month,
    breakdown,
    rawTotal,
    totalPoints,
    remainingPoints: monthlyLimit - totalPoints,
    monthlyLimit,
  };
}

/** Just the breakdown line items from calculateMemberPoints(). */
export async function getPointBreakdown(memberUid, month) {
  const result = await calculateMemberPoints(memberUid, month);
  return result.breakdown;
}

/**
 * Real-time listener across every member's every monthly points document.
 * Firestore has no "list all subcollections" call, so this uses a
 * collection group query matching every memberPoints/{uid}/months/{id}
 * path in one listener — the caller filters by month/member client-side,
 * mirroring the whole-collection + in-memory filter pattern already used
 * by MeetingsContext/ReferralsContext/RToRContext. An unfiltered
 * collection group read like this needs no composite index.
 */
export function subscribeToMemberPoints(onChange, onError) {
  const monthsGroup = collectionGroup(db, "months");

  return onSnapshot(
    monthsGroup,
    (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          memberUid: data.memberUid || docSnap.ref.parent.parent?.id || "",
          points: typeof data.points === "number" ? data.points : 0,
          maxPoints: typeof data.maxPoints === "number" ? data.maxPoints : MONTHLY_POINT_LIMIT,
          month: data.month || docSnap.id,
          updatedAt: data.updatedAt || null,
        });
      });
      onChange(items);
    },
    (error) => {
      console.error("Error fetching member points:", error);
      onError?.(error);
    }
  );
}

/** Real-time listener over one member's point transaction history for one month, newest first. */
export function subscribeToPointTransactions(memberUid, month, onChange, onError) {
  const transactionsRef = collection(db, "memberPoints", memberUid, "months", month, "transactions");
  const transactionsQuery = query(transactionsRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    transactionsQuery,
    (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() }));
      onChange(items);
    },
    (error) => {
      console.error("Error fetching point transactions:", error);
      onError?.(error);
    }
  );
}

/** Translates service/Firebase errors into a message safe to show a user. */
export function friendlyPointsError(error) {
  if (error instanceof PointsError) return error.message;
  if (error?.code === "permission-denied") return "You don't have permission to do this.";
  if (error?.code === "unavailable") return "Network error. Please check your connection and try again.";
  return "Something went wrong. Please try again.";
}
