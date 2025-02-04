import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function Settings() {
  const { logout, deleteAccount } = useAuth();
  const [error, setError] = useState("");
  const redirect = useNavigate();
  const theme = useTheme();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      redirect("/", { replace: true });
    } catch {
      setError("Failed to logout");
    }
  }

  const clearLocalStorage = () => {
    // Show confirmation prompt
    const confirmClear = window.confirm(
      "Are you sure you want to clear all localStorage data? This action cannot be undone."
    );

    if (confirmClear) {
      // Clear only specific items
      localStorage.removeItem(`proteinData-${uid}`);
      localStorage.removeItem(`calorieData-${uid}`);
      // Add any other localStorage keys you need to clear

      alert("LocalStorage has been cleared.");
    } else {
      alert("Clear action canceled.");
    }
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "20px",
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant='h4' gutterBottom>
        Account Settings
      </Typography>

      {error && (
        <Typography variant='body2' color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Stack>
        <Button onClick={clearLocalStorage}>Clear Data</Button>
        <Button
          disabled
          variant='contained'
          onClick={deleteAccount}
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "darkred" : "red",
            color: theme.palette.text.primary,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "maroon" : "darkred",
            },
            margin: "5px",
          }}
        >
          Delete Account
        </Button>{" "}
        <Button
          variant='contained'
          onClick={handleLogout}
          sx={{
            margin: "5px",
          }}
        >
          Logout
        </Button>
      </Stack>
    </Box>
  );
}

export default Settings;
