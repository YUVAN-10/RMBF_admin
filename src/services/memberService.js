import { doc, setDoc, updateDoc, collection, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { uploadImage, deleteImage } from "./storageService";

// Helper to normalize phone
export const normalizePhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};

/**
 * Creates a member.
 * IMPORTANT: According to requirements, this should call a secure backend 
 * (Cloud Function) to generate the Firebase Auth account and create the member document.
 * 
 * For development purposes without a backend, we simulate the backend response 
 * by creating the Firestore document directly. 
 */
export const createMember = async (memberData, profileImageFile) => {
  try {
    // 1. Simulate secure backend call
    // In production, you would do:
    // const response = await fetch("https://your-region-project.cloudfunctions.net/createMember", {
    //   method: "POST",
    //   body: JSON.stringify({ ...memberData })
    // });
    // const result = await response.json();
    // const uid = result.uid;

    // --- SIMULATION FOR DEVELOPMENT ---
    const uid = `mem-${Date.now()}`; // Simulated UID from backend
    // --------------------------------

    let profileImageUrl = null;

    // 2. Upload image to Storage if provided
    if (profileImageFile) {
      profileImageUrl = await uploadImage(`memberProfiles/${uid}/profile.jpg`, profileImageFile);
    }

    // 3. Create document in Firestore
    const docRef = doc(db, "members", uid);
    
    // Normalize phone before saving
    const normalizedPhone = normalizePhone(memberData.phone);
    
    const businessAddress = memberData.businessAddres || memberData.businessAddress || "";
    const experience = memberData.experience || memberData.experienceYears || 0;
    const flyer = memberData.businessFlyer || memberData.flyer || "";

    await setDoc(docRef, {
      ...memberData,
      uid,
      phone: normalizedPhone,
      profileImage: profileImageUrl,
      businessAddres: businessAddress,
      businessAddress: businessAddress,
      experience: experience,
      experienceYears: experience,
      businessFlyer: flyer,
      flyer: flyer,
      status: memberData.status || "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return uid;
  } catch (error) {
    console.error("Error creating member:", error);
    throw new Error("Failed to create member.");
  }
};

export const updateMember = async (uid, memberData, profileImageFile) => {
  try {
    const docRef = doc(db, "members", uid);
    let profileImageUrl = memberData.profileImage;

    // If there's a new image file (base64 data URL), upload it
    if (profileImageFile && profileImageFile.startsWith("data:")) {
      profileImageUrl = await uploadImage(`memberProfiles/${uid}/profile.jpg`, profileImageFile);
    }

    const businessAddress = memberData.businessAddres || memberData.businessAddress || "";
    const experience = memberData.experience || memberData.experienceYears || 0;
    const flyer = memberData.businessFlyer || memberData.flyer || "";

    const updateData = {
      ...memberData,
      profileImage: profileImageUrl,
      businessAddres: businessAddress,
      businessAddress: businessAddress,
      experience: experience,
      experienceYears: experience,
      businessFlyer: flyer,
      flyer: flyer,
      updatedAt: serverTimestamp(),
    };
    
    if (memberData.phone) {
      updateData.phone = normalizePhone(memberData.phone);
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating member:", error);
    throw new Error("Failed to update member.");
  }
};

export const updateMemberStatus = async (uid, status) => {
  try {
    const docRef = doc(db, "members", uid);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating member status:", error);
    throw new Error("Failed to update member status.");
  }
};
