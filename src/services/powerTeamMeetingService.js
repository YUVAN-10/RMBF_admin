import {
  doc,
  collection,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { generatePowerTeamMeetingId, generateQrToken } from "../utils/qrToken";
import { computeMeetingStatus } from "../utils/meetingStatus";
import { getTermForDate, MeetingLimitError } from "../utils/meetingTerm";
import { getMeetingLimits } from "./meetingLimitsService";

export { MeetingLimitError };

// Thrown for expected, user-facing failures (not found, duplicate scan).
// Kept separate from raw Firebase errors so the UI never shows a raw error code.
export class AttendanceError extends Error {}

async function assertUnderPowerTeamTermLimit(meetingDate) {
  const { powerTeamMeetingsPerTerm } = await getMeetingLimits();
  const term = getTermForDate(meetingDate);
  const snapshot = await getDocs(collection(db, "powerTeamMeetings"));

  const countInTerm = snapshot.docs.filter((docSnap) => {
    const data = docSnap.data();
    if (data.status === "cancelled") return false;
    return getTermForDate(data.meetingDate).key === term.key;
  }).length;

  if (countInTerm >= powerTeamMeetingsPerTerm) {
    throw new MeetingLimitError(
      `You've reached the maximum of ${powerTeamMeetingsPerTerm} Power Team meetings for ${term.label}.`
    );
  }
}

export const createPowerTeamMeeting = async (meetingData) => {
  try {
    await assertUnderPowerTeamTermLimit(meetingData.meetingDate);

    const id = generatePowerTeamMeetingId();
    const docRef = doc(db, "powerTeamMeetings", id);

    const newMeeting = {
      ...meetingData,
      id,
      qrToken: generateQrToken(),
      createdBy: "Admin",
      attendanceCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    newMeeting.status = computeMeetingStatus(newMeeting);

    await setDoc(docRef, newMeeting);

    return newMeeting;
  } catch (error) {
    if (error instanceof MeetingLimitError) throw error;
    console.error("Error creating power team meeting:", error);
    throw new Error("Failed to create power team meeting.");
  }
};

export const updatePowerTeamMeeting = async (id, meetingData) => {
  try {
    const docRef = doc(db, "powerTeamMeetings", id);
    const updated = {
      ...meetingData,
      updatedAt: serverTimestamp(),
    };
    updated.status = computeMeetingStatus(updated);

    await updateDoc(docRef, updated);
  } catch (error) {
    console.error("Error updating power team meeting:", error);
    throw new Error("Failed to update power team meeting.");
  }
};

export const cancelPowerTeamMeeting = async (id) => {
  try {
    const docRef = doc(db, "powerTeamMeetings", id);
    await updateDoc(docRef, {
      status: "cancelled",
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error cancelling power team meeting:", error);
    throw new Error("Failed to cancel power team meeting.");
  }
};

async function assertActiveMember(uid) {
  if (!uid) throw new AttendanceError("You must be signed in to mark attendance.");
  const snap = await getDoc(doc(db, "members", uid));
  if (!snap.exists()) {
    throw new AttendanceError("Member profile could not be found.");
  }
  return snap.data();
}

/**
 * Marks attendance for one user at one Power Team Meeting. The attendance
 * document ID is deterministically the user's UID, so this transaction can
 * atomically check-then-set: the first scan wins and its scannedAt (a real
 * serverTimestamp) can never be overwritten by a later, repeat scan.
 */
export const markPowerTeamAttendance = async ({
  meetingId,
  userUid,
  memberId,
  memberName,
  ridNo,
  meetingDate,
}) => {
  if (!meetingId || !userUid) {
    throw new AttendanceError("Invalid meeting or member.");
  }

  const meetingRef = doc(db, "powerTeamMeetings", meetingId);
  const meetingSnap = await getDoc(meetingRef);
  if (!meetingSnap.exists()) {
    throw new AttendanceError("This meeting could not be found.");
  }

  await assertActiveMember(userUid);

  // Eligibility is checked against the meeting's frozen roster snapshot
  // (taken at creation), not the member's current Power Team — membership
  // can change after the meeting was created, but who was eligible for it
  // shouldn't. The real enforcement boundary is the matching firestore.rules
  // check; this is a defensive, user-facing mirror of it.
  const eligibleMemberIds = meetingSnap.data().eligibleMemberIds;
  if (!Array.isArray(eligibleMemberIds) || !eligibleMemberIds.includes(userUid)) {
    throw new AttendanceError("You are not a member of this Power Team.");
  }

  const attendanceRef = doc(db, "powerTeamMeetings", meetingId, "attendance", userUid);

  await runTransaction(db, async (tx) => {
    const existing = await tx.get(attendanceRef);
    if (existing.exists()) {
      throw new AttendanceError("Attendance already marked for this meeting.");
    }

    tx.set(attendanceRef, {
      userUid,
      memberId: memberId || userUid,
      memberName: memberName || "",
      ridNo: ridNo || "",
      meetingDate: meetingDate || meetingSnap.data().meetingDate || "",
      scannedAt: serverTimestamp(),
      status: "present",
    });

    tx.update(meetingRef, { attendanceCount: increment(1) });
  });
};

/** Real-time listener over one meeting's attendance subcollection. */
export function subscribeToPowerTeamMeetingAttendance(meetingId, onChange, onError) {
  const attendanceRef = collection(db, "powerTeamMeetings", meetingId, "attendance");

  return onSnapshot(
    attendanceRef,
    (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() }));
      onChange(items);
    },
    (error) => {
      console.error("Error fetching power team meeting attendance:", error);
      onError?.(error);
    }
  );
}

/** Translates service/Firebase errors into a message safe to show a user. */
export function friendlyAttendanceError(error) {
  if (error instanceof AttendanceError) return error.message;
  if (error?.code === "permission-denied") return "You don't have permission to do this.";
  if (error?.code === "unavailable") return "Network error. Please check your connection and try again.";
  return "Something went wrong. Please try again.";
}
