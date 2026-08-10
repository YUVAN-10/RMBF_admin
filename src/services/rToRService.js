import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export const createRToR = async (rtorData) => {
  try {
    const id = `rtor-${Date.now()}`;
    const docRef = doc(db, "rToR", id);
    
    await setDoc(docRef, {
      ...rtorData,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return id;
  } catch (error) {
    console.error("Error creating R to R record:", error);
    throw new Error("Failed to create R to R record.");
  }
};
