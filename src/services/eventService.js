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
    const payload = {
      ...eventData,
      id,
      name: eventData.name || eventData["Event Name"] || "",
      "Event Name": eventData.name || eventData["Event Name"] || "",
      eventDate: eventData.eventDate || eventData.Date || "",
      Date: eventData.eventDate || eventData.Date || "",
      description: eventData.description || eventData.Description || "",
      Description: eventData.description || eventData.Description || "",
      location: eventData.location || eventData.Location || "",
      Location: eventData.location || eventData.Location || "",
      eventTime: eventData.eventTime || eventData.time || "",
      time: eventData.eventTime || eventData.time || "",
      imageUrl: eventImageUrl || eventData.imageUrl || "",
      eventImage: eventImageUrl || eventData.imageUrl || "",
      status: eventData.status || "Active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload);
    return id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event.");
  }
};

export const updateEvent = async (id, eventData, eventImageFile) => {
  try {
    const docRef = doc(db, "events", id);
    let eventImageUrl = eventData.imageUrl || eventData.eventImage;

    if (eventImageFile && eventImageFile.startsWith("data:")) {
      eventImageUrl = await uploadImage(`eventImages/${id}/image.jpg`, eventImageFile);
    }

    const payload = {
      ...eventData,
      name: eventData.name || eventData["Event Name"] || "",
      "Event Name": eventData.name || eventData["Event Name"] || "",
      eventDate: eventData.eventDate || eventData.Date || "",
      Date: eventData.eventDate || eventData.Date || "",
      description: eventData.description || eventData.Description || "",
      Description: eventData.description || eventData.Description || "",
      location: eventData.location || eventData.Location || "",
      Location: eventData.location || eventData.Location || "",
      eventTime: eventData.eventTime || eventData.time || "",
      time: eventData.eventTime || eventData.time || "",
      imageUrl: eventImageUrl || "",
      eventImage: eventImageUrl || "",
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, payload);
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
