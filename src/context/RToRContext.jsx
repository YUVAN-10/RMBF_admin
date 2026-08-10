import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { createRToR } from "../services/rToRService";

const RToRContext = createContext(null);

export function RToRProvider({ children }) {
  const [rtorRecords, setRtorRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "rToR"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const recordsData = [];
        snapshot.forEach((docSnap) => {
          recordsData.push({ id: docSnap.id, ...docSnap.data() });
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
