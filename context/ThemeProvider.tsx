"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// enum ThemeMode {
//     Light = "light",
//     Dark = "dark",
// }

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState("");
  const handleThemeChanges = () => {
    if (mode === "dark") {
      setMode("light");
      document.documentElement.classList.remove("light");
    } else {
      setMode("dark");
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    handleThemeChanges();
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
