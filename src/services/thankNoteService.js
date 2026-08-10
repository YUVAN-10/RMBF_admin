import { collection, doc, setDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export const createThankNote = async (noteData) => {
  try {
    const id = `tn-${Date.now()}`;
    const docRef = doc(db, "thankNotes", id);
    
    await setDoc(docRef, {
      ...noteData,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return id;
  } catch (error) {
    console.error("Error creating thank note:", error);
    throw new Error("Failed to create thank note.");
  }
};
