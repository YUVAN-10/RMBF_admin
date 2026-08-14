import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { subscribeToMemberPoints } from "../services/pointsService";

const PointsContext = createContext(null);

export function PointsProvider({ children }) {
  // Every member's every monthly points document — the Points page filters
  // this down to the selected month client-side (see PointsPage.jsx).
  const [monthlyPoints, setMonthlyPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMemberPoints(
      (items) => {
        setMonthlyPoints(items);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ monthlyPoints, loading }), [monthlyPoints, loading]);

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return ctx;
}
