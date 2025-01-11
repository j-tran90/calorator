import React from "react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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

      <button title='Logout' onClick={handleLogout}>
        Logout
      </button>
      <button
        title='Disabled'
        onClick={deleteAccount}
        style={{ color: "#999", backgroundColor: "#555" }}
        disabled
      >
        Delete Account
      </button>
    </>
  );
}

export default Settings;
