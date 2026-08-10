import { doc, setDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { uploadImage, deleteImage } from "./storageService";

export const createEvent = async (eventData, eventImageFile) => {
  try {
    const id = `evt-${Date.now()}`;
    let eventImageUrl = null;

    if (eventImageFile) {
      eventImageUrl = await uploadImage(`eventImages/${id}/image.jpg`, eventImageFile);
    }

    const docRef = doc(db, "events", id);
    await setDoc(docRef, {
      ...eventData,
      id,
      imageUrl: eventImageUrl,
      status: eventData.status || "Active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event.");
  }
};

export const updateEvent = async (id, eventData, eventImageFile) => {
  try {
    const docRef = doc(db, "events", id);
    let eventImageUrl = eventData.imageUrl;

    if (eventImageFile && eventImageFile.startsWith("data:")) {
      eventImageUrl = await uploadImage(`eventImages/${id}/image.jpg`, eventImageFile);
    }

    await updateDoc(docRef, {
      ...eventData,
      imageUrl: eventImageUrl,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Failed to update event.");
  }
};

export const deleteEvent = async (id) => {
  try {
    await deleteDoc(doc(db, "events", id));
    await deleteImage(`eventImages/${id}/image.jpg`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Failed to delete event.");
  }
};
