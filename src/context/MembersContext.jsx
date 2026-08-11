import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { createMember, updateMember } from "../services/memberService";

const MembersContext = createContext(null);

export function nextRidNo(members) {
  const maxNum = members.reduce((max, member) => {
    const num = parseInt((member.ridNo || "").replace(/\D/g, ""), 10);
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return `RMBF${String(maxNum + 1).padStart(3, "0")}`;
}

function getFieldValue(data, ...keys) {
  if (!data) return undefined;
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      return data[key];
    }
  }
  const dataKeys = Object.keys(data);
  for (const key of keys) {
    const cleanKey = key.toLowerCase().replace(/[\s_-]/g, "");
    const matchedKey = dataKeys.find(
      (k) => k.toLowerCase().replace(/[\s_-]/g, "") === cleanKey
    );
    if (matchedKey && data[matchedKey] !== undefined && data[matchedKey] !== null && data[matchedKey] !== "") {
      return data[matchedKey];
    }
  }
  return undefined;
}

export function normalizeMember(docId, data) {
  if (!data) return { id: docId, uid: docId };

  const fullName = getFieldValue(data, "fullName", "name", "memberName", "userName") || "Unknown Member";
  const ridNo = getFieldValue(data, "ridNo", "rid", "memberId") || "—";
  const email = getFieldValue(data, "email") || "";
  const phone = getFieldValue(data, "phone", "mobile", "contact") || "";
  const status = (getFieldValue(data, "status") || "active").toLowerCase();
  const profileImage = getFieldValue(data, "profileImage", "imageUrl", "image", "photo") || "";

  // Business fields matching exact Firestore keys
  const companyName = getFieldValue(data, "companyName", "company") || "";
  const businessType = getFieldValue(data, "businessType", "category") || "";
  const businessAddress = getFieldValue(data, "businessAddres", "businessAddress") || "";
  const officeNo = getFieldValue(data, "officeNo", "officePhone") || "";
  const websiteUrl = getFieldValue(data, "websiteUrl", "website") || "";
  const socialMedia = getFieldValue(data, "socialMedia") || "";
  const businessStartDate = getFieldValue(data, "businessStartDate") || null;
  const experience = getFieldValue(data, "experience", "experienceYears") || "";
  const businessExpertise = getFieldValue(data, "businessExpertise") || "";
  const whyBuyFromYou = getFieldValue(data, "whyBuyFromYou") || "";
  const aboutBusiness = getFieldValue(data, "aboutBusiness") || "";
  const businessMission = getFieldValue(data, "businessMission") || "";
  const businessVision = getFieldValue(data, "businessVision") || "";
  const flyer = getFieldValue(data, "businessFlyer", "flyer") || "";

  // Personal fields
  const dateOfBirth = getFieldValue(data, "dateOfBirth", "dob") || null;
  const bloodGroup = getFieldValue(data, "bloodGroup", "blood") || "";
  const education = getFieldValue(data, "education", "qualification") || "";
  const address = getFieldValue(data, "address") || "";

  // Membership & Team
  const joiningDate = getFieldValue(data, "joiningDate") || null;
  const powerTeam = getFieldValue(data, "powerTeam") || "";
  const position = getFieldValue(data, "position", "role") || "";
  const director = getFieldValue(data, "director") || "";
  const coordinator = getFieldValue(data, "coordinator") || "";
  const introducedBy = getFieldValue(data, "introducedBy") || "";
  const authenticatedBy = getFieldValue(data, "authenticatedBy") || "";

  return {
    ...data,
    id: docId,
    uid: data.uid || docId,
    fullName,
    name: fullName,
    ridNo,
    email,
    phone,
    status,
    profileImage,
    companyName,
    businessType,
    businessAddress,
    businessAddres: businessAddress,
    officeNo,
    websiteUrl,
    socialMedia,
    businessStartDate,
    experience,
    experienceYears: experience,
    businessExpertise,
    whyBuyFromYou,
    aboutBusiness,
    businessMission,
    businessVision,
    businessFlyer: flyer,
    flyer,
    dateOfBirth,
    dob: dateOfBirth,
    bloodGroup,
    education,
    address,
    joiningDate,
    powerTeam,
    position,
    director,
    coordinator,
    introducedBy,
    authenticatedBy,
  };
}

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const membersRef = collection(db, "members");

    const unsubscribe = onSnapshot(
      membersRef,
      (snapshot) => {
        const membersData = [];
        snapshot.forEach((docSnap) => {
          membersData.push(normalizeMember(docSnap.id, docSnap.data()));
        });
        
        // Sort in memory by ridNo / createdAt
        membersData.sort((a, b) => (a.ridNo || "").localeCompare(b.ridNo || ""));

        setMembers(membersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching members:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      members,
      loading,
      getMemberById: (id) => members.find((member) => member.id === id || member.uid === id) ?? null,
      addMember: async (data, profileImageFile) => {
        const ridNo = data.ridNo?.trim() || nextRidNo(members);
        const finalData = { ...data, ridNo };
        return await createMember(finalData, profileImageFile);
      },
      updateMember: async (uid, data, profileImageFile) => {
        await updateMember(uid, data, profileImageFile);
      },
    }),
    [members, loading]
  );

  return <MembersContext.Provider value={value}>{children}</MembersContext.Provider>;
}

export function useMembers() {
  const ctx = useContext(MembersContext);
  if (!ctx) {
    throw new Error("useMembers must be used within a MembersProvider");
  }
  return ctx;
}
