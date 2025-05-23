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
            paper: mode === "dark" ? "#121212" : "#fff",
          },
          text: {
            primary: mode === "dark" ? "#d5cece" : "#000",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "20px", // Global border radius for buttons
                height: "48px", // Uniform height
                textTransform: "none", // Optional: Disable uppercase text
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: "20px", // Global border radius for input fields
              },
            },
          },
          MuiFilledInput: {
            styleOverrides: {
              root: {
                borderRadius: "20px", // Global border radius for filled input fields
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                borderRadius: "20px", // Global border radius for base input fields
              },
            },
          },
          MuiSnackbar: {
            styleOverrides: {
              root: {
                borderRadius: "20px", // Add border radius to Snackbar
                overflow: "hidden", // Ensure content stays within the border radius
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: "20px", // Add border radius to Alert inside Snackbar
              },
            },
          },
        },
        breakpoints: {
          values: {
            xxs: 0,
            xs: 430,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
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
