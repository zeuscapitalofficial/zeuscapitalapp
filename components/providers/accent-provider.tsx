"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type DashboardAccent =
  | "purple"
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "indigo";

interface AccentContextValue {
  accent: DashboardAccent;
  setAccent: (accent: DashboardAccent) => void;
}

const AccentContext = createContext<AccentContextValue | undefined>(undefined);

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState<DashboardAccent>("purple");

  useEffect(() => {
    const saved = localStorage.getItem("dashboard-accent");

    if (saved) {
      setAccent(saved as DashboardAccent);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;

    localStorage.setItem("dashboard-accent", accent);
  }, [accent]);

  return (
    <AccentContext.Provider
      value={{
        accent,
        setAccent,
      }}
    >
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent() {
  const context = useContext(AccentContext);

  if (!context) {
    throw new Error("useAccent must be inside AccentProvider");
  }

  return context;
}
