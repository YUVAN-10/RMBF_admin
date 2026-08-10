import { createContext, useContext, useEffect, useState } from "react";

const defaultRoles = ["President", "Vice President", "Secretary/Treasurer"];

const initialMasters = {
  positions: defaultRoles,
  directors: defaultRoles,
  coordinators: defaultRoles,
};

const MastersContext = createContext(null);

export function MastersProvider({ children }) {
  const [masters, setMasters] = useState(() => {
    const saved = localStorage.getItem("rmbf_masters");
    return saved ? JSON.parse(saved) : initialMasters;
  });

  useEffect(() => {
    localStorage.setItem("rmbf_masters", JSON.stringify(masters));
  }, [masters]);

  const addMasterItem = (category, item) => {
    setMasters((prev) => ({
      ...prev,
      [category]: [...prev[category], item],
    }));
  };

  const removeMasterItem = (category, item) => {
    setMasters((prev) => ({
      ...prev,
      [category]: prev[category].filter((i) => i !== item),
    }));
  };

  return (
    <MastersContext.Provider value={{ masters, addMasterItem, removeMasterItem }}>
      {children}
    </MastersContext.Provider>
  );
}

export function useMasters() {
  const ctx = useContext(MastersContext);
  if (!ctx) {
    throw new Error("useMasters must be used within a MastersProvider");
  }
  return ctx;
}
