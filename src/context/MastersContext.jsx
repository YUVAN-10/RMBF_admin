import { createContext, useContext, useEffect, useState } from "react";

const defaultRoles = ["President", "Vice President", "Secretary/Treasurer"];

const defaultDirectors = [
  "Chapter Growth",
  "Lead Visitor Host",
  "Application Review",
  "Mentor Mentee",
  "Attendance Director",
  "Referral Reality Check",
  "Inter- Chaper",
  "Business Growth",
  "Advisor",
  "App Lead & Business Growth",
];

const defaultPowerTeams = [
  "Retail and Wholesale Power Team",
  "Manufacturing Power Team",
  "Textiles Power Team",
  "Professional Services Power Team",
  "Trading Power Team",
];

const defaultCoordinators = [
  "R to R",
  "Contribution",
  "Training",
  "Presentation (8 min)",
  "Attendance",
  "Media",
  "Venue",
  "Power Team",
  "Greetings",
  "Testimonial",
  "Social",
  "LVH",
  "Education Slot",
  "Activities",
];

const legacyDirectorValues = [
  "Chapter Growth",
  "Lead Visitor Host",
  "Application Review",
  "Mentor Mentee",
  "Attendance Director",
  "Referral Reality Check",
  "Inter- Chaper",
  "Business Growth",
  "Advisor",
  "App Lead & Business Growth",
];

const initialMasters = {
  positions: defaultRoles,
  directors: defaultDirectors,
  coordinators: defaultCoordinators,
  powerTeams: defaultPowerTeams,
};

const legacyCoordinatorValues = ["President", "Vice President", "Secretary/Treasurer"];

function migrateMasters(savedMasters) {
  const parsed = savedMasters ? JSON.parse(savedMasters) : {};
  const safeDirectors = Array.isArray(parsed.directors)
    ? parsed.directors.filter(
        (item) => typeof item === "string" && !legacyDirectorValues.includes(item)
      )
    : [];
  const safeCoordinators = Array.isArray(parsed.coordinators)
    ? parsed.coordinators.filter(
        (item) => typeof item === "string" && !legacyCoordinatorValues.includes(item)
      )
    : [];

  return {
    ...initialMasters,
    ...parsed,
    directors: [...new Set([...defaultDirectors, ...safeDirectors])],
    coordinators: [...new Set([...defaultCoordinators, ...safeCoordinators])],
  };
}

const MastersContext = createContext(null);

export function MastersProvider({ children }) {
  const [masters, setMasters] = useState(() => {
    const saved = localStorage.getItem("rmbf_masters");
    return saved ? migrateMasters(saved) : initialMasters;
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
