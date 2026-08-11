import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export const createRToR = async (rtorData) => {
  try {
    const id = `rtor-${Date.now()}`;
    const docRef = doc(db, "rToR", id);
    
    const fromMemberUid = rtorData.fromMemberUid || rtorData.fromUserId || rtorData.fromMemberId || "";
    const toMemberUid = rtorData.toMemberUid || rtorData.toUserId || rtorData.toMemberId || "";
    const term = rtorData.term || "Term 1";

    await setDoc(docRef, {
      ...rtorData,
      id,
      fromMemberUid,
      fromUserId: fromMemberUid,
      toMemberUid,
      toUserId: toMemberUid,
      term,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return id;
  } catch (error) {
    console.error("Error creating R to R record:", error);
    throw new Error("Failed to create R to R record.");
  }
};
