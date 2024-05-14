import { Switch } from "@mui/material";
import { createContext, useContext, useState, useEffect } from "react";

// Create DarkModeContext
const DarkModeContext = createContext();

// Custom hook to use the DarkModeContext
export const useDarkMode = () => useContext(DarkModeContext);

// DarkModeProvider component
export const DarkModeProvider = ({ children }) => {
  // Initialize state with value from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    console.log("Initializing dark mode from localStorage:", savedMode);
    return savedMode !== null ? JSON.parse(savedMode) : false;
  });

  // Toggle dark mode state and persist to localStorage
  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => {
      const newMode = !prevDarkMode;
      console.log("Toggling dark mode. New mode:", newMode);
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  // Side effect to add/remove dark mode class based on state
  useEffect(() => {
    console.log("Applying dark mode:", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// DarkModeToggle component
export const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div>
      <Switch
        checked={darkMode}
        onChange={toggleDarkMode}
        inputProps={{ "aria-label": "Toggle dark mode" }}
      />
      <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
    </div>
  );
};

// Ensure each component is exported only once
export default useDarkMode;
