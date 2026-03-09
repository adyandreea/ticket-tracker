import React, { createContext, useState, useContext, useMemo } from "react";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./DarkTheme.js";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("app-theme");
    return savedTheme === "dark";
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("app-theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const contextValue = useMemo(
    () => ({
      isDarkMode,
      toggleDarkMode,
    }),
    [isDarkMode],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
