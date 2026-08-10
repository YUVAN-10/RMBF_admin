import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { initialMembers } from "../data/membersData";

// Frontend-only member store. Each method here is a placeholder for a
// future Firestore call (members/{memberId}) — addMember -> setDoc,
// updateMember -> updateDoc, getMemberById -> getDoc/onSnapshot.
// Intentionally no deleteMember/removeMember method exists in this module.

const MembersContext = createContext(null);

export function nextRidNo(members) {
  const maxNum = members.reduce((max, member) => {
    const num = parseInt(member.ridNo.replace(/\D/g, ""), 10);
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return `RMBF${String(maxNum + 1).padStart(3, "0")}`;
}

export function MembersProvider({ children }) {
  const [members, setMembers] = useState(() => {
    const currentMonth = new Date().getUTCMonth();
    const currentTerm = currentMonth >= 0 && currentMonth <= 5 ? "term1" : "term2";
    const currentYear = new Date().getUTCFullYear();
    const termKey = `${currentYear}-${currentTerm}`;
    
    const storedTermKey = localStorage.getItem("rmbf_term_key");
    const storedMembers = localStorage.getItem("rmbf_members");
    
    let initial = storedMembers ? JSON.parse(storedMembers) : initialMembers;
    
    if (storedTermKey && storedTermKey !== termKey) {
      initial = initial.map((member) => ({
        ...member,
        position: "",
        coordinator: "",
        director: "",
      }));
    }
    
    localStorage.setItem("rmbf_term_key", termKey);
    return initial;
  });

  useEffect(() => {
    localStorage.setItem("rmbf_members", JSON.stringify(members));
  }, [members]);

  const value = useMemo(
    () => ({
      members,
      getMemberById: (uid) => members.find((member) => member.uid === uid) ?? null,
      addMember: (data) => {
        const now = new Date().toISOString();
        const newMember = {
          ...data,
          uid: `mem-${Date.now()}`,
          ridNo: data.ridNo?.trim() || nextRidNo(members),
          createdAt: now,
          updatedAt: now,
        };
        setMembers((prev) => [newMember, ...prev]);
        return newMember;
      },
      updateMember: (uid, data) => {
        const now = new Date().toISOString();
        setMembers((prev) =>
          prev.map((member) =>
            member.uid === uid ? { ...member, ...data, updatedAt: now } : member
          )
        );
      },
    }),
    [members]
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
