import React, { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

export const ThemeContext = createContext();

const ThemeProviderComponent = ({ children }) => {
  const storedTheme = localStorage.getItem("theme") || "light";
  const [mode, setMode] = useState(storedTheme);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#4FC483",
          },
          background: {
            default: mode === "dark" ? "#121212" : "#fff",
            paper: mode === "dark" ? "#1e1e1e" : "#fff",
          },
          text: {
            primary: mode === "dark" ? "#fff" : "#000",
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderComponent;
