import React, { useState, useContext } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { ThemeContext } from "../../contexts/ThemeContext"; // Import ThemeContext
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";

function Settings() {
  const { logout, deleteAccount } = useAuth();
  const { mode, setMode } = useContext(ThemeContext); // Access ThemeContext
  const [error, setError] = useState("");
  const [confirmClear, setConfirmClear] = useState(false); // State to toggle confirmation buttons
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  }); // Snackbar state
  const redirect = useNavigate();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      redirect("/", { replace: true });
    } catch {
      setError("Failed to logout");
    }
  }

  const clearIndexedDB = async () => {
    // Open the IndexedDB database
    const request = indexedDB.open("caloratorDB");

    request.onsuccess = (event) => {
      const db = event.target.result;

      // Check if there are any object stores
      if (db.objectStoreNames.length === 0) {
        setSnackbar({
          open: true,
          message: "No data to clear in IndexedDB.",
          severity: "info",
        });
        setConfirmClear(false); // Reset button state
        return;
      }

      // Get all object stores and clear them
      const transaction = db.transaction(db.objectStoreNames, "readwrite");
      db.objectStoreNames.forEach((storeName) => {
        const objectStore = transaction.objectStore(storeName);
        objectStore.clear();
      });

      transaction.oncomplete = () => {
        setSnackbar({
          open: true,
          message: "IndexedDB data has been cleared.",
          severity: "success",
        });
        setConfirmClear(false); // Reset button state
      };

      transaction.onerror = () => {
        setSnackbar({
          open: true,
          message: "Failed to clear IndexedDB data.",
          severity: "error",
        });
      };
    };

    request.onerror = () => {
      setSnackbar({
        open: true,
        message: "Failed to open IndexedDB.",
        severity: "error",
      });
    };
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "20px",
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

      {/* Settings List */}
      <List
        component={Paper}
        sx={{ borderRadius: "20px", p: { xs: 1, md: 2 } }}
      >
        {/* Dark Mode Toggle */}
        <ListItem
          sx={{
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <SettingsIcon sx={{ mr: 1 }} />
          <ListItemText primary='Dark Mode' />
          <Switch
            checked={mode === "dark"}
            onChange={() => setMode(mode === "light" ? "dark" : "light")}
          />
        </ListItem>

        {/* Clear Data */}
        <ListItem
          onClick={() => setConfirmClear(true)}
          sx={{
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          <ListItemText primary='Clear Data' />
        </ListItem>

        {/* Delete Account */}
        <ListItem
          disabled
          sx={{
            opacity: 0.5,
            cursor: "not-allowed",
            "&:hover": {
              backgroundColor: "inherit",
            },
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          <ListItemText primary='Delete Account' />
        </ListItem>

        {/* Logout */}
        <ListItem
          onClick={handleLogout}
          sx={{
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1 }} />
          <ListItemText primary='Logout' />
        </ListItem>
      </List>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Settings;
