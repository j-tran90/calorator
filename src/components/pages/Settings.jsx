import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Import MUI theme hook
import DarkModeToggle from "../features/darkmode/DarkModeToggle";

function Settings() {
  const { logout, deleteAccount } = useAuth();
  const [error, setError] = useState("");
  const redirect = useNavigate();
  const theme = useTheme(); // Get the current theme

  async function handleLogout() {
    setError("");

    try {
      await logout();
      redirect("/", { replace: true });
    } catch {
      setError("Failed to logout");
    }
  }

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "20px",
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={handleLogout}
        sx={{
          color: theme.palette.text.primary,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[800]
              : theme.palette.primary.main,
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[700]
                : theme.palette.primary.dark,
          },
          margin: "5px",
        }}
      >
        Logout
      </Button>

      <Button
        disabled
        variant="contained"
        onClick={deleteAccount}
        sx={{
          backgroundColor:
            theme.palette.mode === "dark" ? "darkred" : "red",
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.palette.mode === "dark" ? "maroon" : "darkred",
          },
          margin: "5px",
        }}
      >
        Delete Account
      </Button>

      <DarkModeToggle />
    </Box>
  );
}

export default Settings;
