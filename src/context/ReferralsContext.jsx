import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { subscribeToReferrals } from "../services/referralService";

const ReferralsContext = createContext(null);

export function ReferralsProvider({ children }) {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToReferrals(
      (items) => {
        setReferrals(items);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ referrals, loading }), [referrals, loading]);

  return <ReferralsContext.Provider value={value}>{children}</ReferralsContext.Provider>;
}

export function useReferrals() {
  const ctx = useContext(ReferralsContext);
  if (!ctx) {
    throw new Error("useReferrals must be used within a ReferralsProvider");
  }
  return ctx;
}
