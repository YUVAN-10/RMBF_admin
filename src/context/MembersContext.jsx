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

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const membersData = [];
        snapshot.forEach((doc) => {
          membersData.push({ id: doc.id, uid: doc.id, ...doc.data() });
        });
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
