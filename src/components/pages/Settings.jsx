import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
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

      <Button
        variant='contained'
        onClick={handleLogout}
        sx={{
          margin: "5px",
        }}
      >
        Logout
      </Button>

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
      </Button>
    </Box>
  );
}

export default Settings;
