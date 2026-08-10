import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase/config";

// Uploads a base64 Data URL to Firebase Storage and returns the download URL
export const uploadImage = async (path, dataUrl) => {
  if (!dataUrl) return null;
  // If it's already a URL from Firebase, just return it
  if (dataUrl.startsWith("http")) return dataUrl;

  const storageRef = ref(storage, path);
  try {
    const snapshot = await uploadString(storageRef, dataUrl, "data_url");
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to storage:", error);
    throw new Error("Failed to upload image.");
  }
};

// Deletes an image from Firebase Storage using its path
export const deleteImage = async (path) => {
  if (!path) return;
  const storageRef = ref(storage, path);
  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image from storage:", error);
    // Ignore not-found errors
    if (error.code !== "storage/object-not-found") {
      throw new Error("Failed to delete image.");
    }
  }
};
