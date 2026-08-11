import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { createRToR } from "../services/rToRService";

const RToRContext = createContext(null);

export function normalizeRToR(docId, data) {
  if (!data) return { id: docId };

  const fromMemberUid = data.fromMemberUid || data.fromUserId || data.fromMemberId || data.fromId || "";
  const toMemberUid = data.toMemberUid || data.toUserId || data.toMemberId || data.toId || "";
  const term = data.term || "Term 1";
  const createdAt = data.createdAt || new Date();

  return {
    ...data,
    id: docId,
    fromMemberUid,
    fromUserId: fromMemberUid,
    fromMemberId: fromMemberUid,
    toMemberUid,
    toUserId: toMemberUid,
    toMemberId: toMemberUid,
    term,
    createdAt,
  };
}

export function RToRProvider({ children }) {
  const [rtorRecords, setRtorRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rtorRef = collection(db, "rToR");
    const unsubscribe = onSnapshot(
      rtorRef,
      (snapshot) => {
        const recordsData = [];
        snapshot.forEach((docSnap) => {
          recordsData.push(normalizeRToR(docSnap.id, docSnap.data()));
        });

        // In-memory sort by createdAt descending
        recordsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA;
        });

        setRtorRecords(recordsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching R to R records:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      rtorRecords,
      loading,
      addRToR: async (data) => {
        return await createRToR(data);
      },
    }),
    [rtorRecords, loading]
  );

  return <RToRContext.Provider value={value}>{children}</RToRContext.Provider>;
}

export function useRToR() {
  const ctx = useContext(RToRContext);
  if (!ctx) {
    throw new Error("useRToR must be used within an RToRProvider");
  }
  return ctx;
}
