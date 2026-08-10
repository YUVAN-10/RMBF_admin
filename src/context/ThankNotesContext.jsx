import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { createThankNote } from "../services/thankNoteService";

const ThankNotesContext = createContext(null);

export function ThankNotesProvider({ children }) {
  const [thankNotes, setThankNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "thankNotes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesData = [];
        snapshot.forEach((docSnap) => {
          notesData.push({ id: docSnap.id, ...docSnap.data() });
        });
        setThankNotes(notesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching thank notes:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      thankNotes,
      loading,
      addThankNote: async (data) => {
        return await createThankNote(data);
      },
    }),
    [thankNotes, loading]
  );

  return <ThankNotesContext.Provider value={value}>{children}</ThankNotesContext.Provider>;
}

export function useThankNotes() {
  const ctx = useContext(ThankNotesContext);
  if (!ctx) {
    throw new Error("useThankNotes must be used within a ThankNotesProvider");
  }
  return ctx;
}
