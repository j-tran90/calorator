import React from "react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function Settings() {
  const { logout, deleteAccount } = useAuth();

  const [error, setError] = useState("");
  const redirect = useNavigate();

  async function handleLogout() {
    setError(error);

    try {
      await logout();
      redirect("/", { replace: true });
    } catch {
      setError("Failed to logout");
    }
  }
  return (
    <>
      <h1>Accounts Settings</h1>

      <Button
        variant='contained'
        onClick={handleLogout}
        sx={{
          backgroundColor: "#000",
          "&:hover": { backgroundColor: "#333" },
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
          backgroundColor: "red",
          "&:hover": { backgroundColor: "maroon" },
          margin: "5px",
        }}
      >
        Delete Account
      </Button>
    </>
  );
}

export default Settings;
