import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { subscribeToTerms, ensureInitialTerm, advanceTermIfNeeded } from "../services/termsService";

const TermsContext = createContext(null);

export function TermsProvider({ children }) {
  const { user } = useAuth();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const seededRef = useRef(false);
  const advancingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeToTerms(
      (items) => {
        setTerms(items);
        setLoading(false);

        if (items.length === 0 && !seededRef.current && user?.uid) {
          seededRef.current = true;
          ensureInitialTerm(user.uid).catch((err) => console.error("Failed to seed initial term:", err));
        }
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const activeTerm = useMemo(() => terms.find((t) => t.status === "active") || terms[0] || null, [terms]);

  // Every admin session checks the active term on load — deterministic doc
  // IDs in advanceTermIfNeeded make repeated/concurrent calls harmless, so
  // no cross-session coordination is needed (see termsService.js).
  useEffect(() => {
    if (!activeTerm || !user?.uid || advancingRef.current) return;

    advancingRef.current = true;
    advanceTermIfNeeded(activeTerm, user.uid)
      .catch((err) => console.error("Failed to advance term:", err))
      .finally(() => {
        advancingRef.current = false;
      });
  }, [activeTerm, user?.uid]);

  const value = useMemo(() => ({ terms, activeTerm, loading }), [terms, activeTerm, loading]);

  return <TermsContext.Provider value={value}>{children}</TermsContext.Provider>;
}

export function useTerms() {
  const ctx = useContext(TermsContext);
  if (!ctx) {
    throw new Error("useTerms must be used within a TermsProvider");
  }
  return ctx;
}
