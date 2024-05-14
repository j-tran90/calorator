import { Switch } from "@mui/material";
import { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  useEffect(() => {
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

// Export all components
export default { DarkModeProvider, DarkModeToggle, useDarkMode };
