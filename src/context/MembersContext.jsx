import { createContext, useContext, useMemo, useState } from "react";
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
  const [members, setMembers] = useState(initialMembers);

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
