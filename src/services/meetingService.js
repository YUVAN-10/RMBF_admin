import { doc, setDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { generateMeetingId, generateQrToken } from "../utils/qrToken";
import { computeMeetingStatus } from "../utils/meetingStatus";

export const createMeeting = async (meetingData) => {
  try {
    const id = generateMeetingId();
    const docRef = doc(db, "meetings", id);

    const newMeeting = {
      ...meetingData,
      id,
      qrToken: generateQrToken(),
      createdBy: "Admin",
      attendance: [], // Sub-collections are created when attendance is actually marked
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    newMeeting.status = computeMeetingStatus(newMeeting);

    await setDoc(docRef, newMeeting);

    return newMeeting;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw new Error("Failed to create meeting.");
  }
};

export const updateMeeting = async (id, meetingData) => {
  try {
    const docRef = doc(db, "meetings", id);
    const updated = {
      ...meetingData,
      updatedAt: serverTimestamp(),
    };
    updated.status = computeMeetingStatus(updated);

    await updateDoc(docRef, updated);
  } catch (error) {
    console.error("Error updating meeting:", error);
    throw new Error("Failed to update meeting.");
  }
};

export const cancelMeeting = async (id) => {
  try {
    const docRef = doc(db, "meetings", id);
    await updateDoc(docRef, {
      status: "cancelled",
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error cancelling meeting:", error);
    throw new Error("Failed to cancel meeting.");
  }
};
