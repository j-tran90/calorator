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

  const clearIndexedDBAndLocalStorage = async () => {
    // Clear localStorage
    localStorage.clear();

    // Open the IndexedDB database
    const request = indexedDB.open("caloratorDB");

    request.onsuccess = (event) => {
      const db = event.target.result;

      // Check if there are any object stores
      if (db.objectStoreNames.length === 0) {
        setSnackbar({
          open: true,
          message: "No data to clear in IndexedDB or Local Storage.",
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
          message: "IndexedDB and Local Storage data have been cleared.",
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

  const listItemStyles = (isDisabled) => ({
    "&:hover": {
      backgroundColor: isDisabled ? "inherit" : "rgba(0, 0, 0, 0.08)",
      borderRadius: "10px",
    },
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? "not-allowed" : "pointer",
  });

  return (
    <Box
      sx={{
        textAlign: "center",
        m: 1,
      }}
    >
      <Typography variant='h5' gutterBottom>
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
        sx={{ borderRadius: "20px", p: { xxs: 1, md: 2 } }}
      >
        {/* Dark Mode Toggle */}
        <ListItem>
          <SettingsIcon sx={{ mr: 1 }} />
          <ListItemText primary='Dark Mode' />
          <Switch
            checked={mode === "dark"}
            onChange={() => setMode(mode === "light" ? "dark" : "light")}
          />
        </ListItem>

        {/* Clear Data */}
        <ListItem
          onClick={() => setConfirmClear(!confirmClear)}
          sx={{
            ...listItemStyles(false),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          {/* Clear Data Text */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DeleteIcon sx={{ mr: 1 }} />
            <ListItemText primary='Clear Data' />
          </Box>

          {/* Confirm and Cancel Buttons */}
          {confirmClear && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {/* Confirm Button */}
              <Box
                component='button'
                onClick={(e) => {
                  e.stopPropagation();
                  clearIndexedDBAndLocalStorage();
                }}
                sx={{
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "darkgreen",
                  },
                }}
              >
                Confirm
              </Box>

              {/* Cancel Button */}
              <Box
                component='button'
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the ListItem's onClick
                  setConfirmClear(false);
                }}
                sx={{
                  backgroundColor: "gray",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "darkgray",
                  },
                }}
              >
                Cancel
              </Box>
            </Box>
          )}
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
            ...listItemStyles(false),
            color: "red",
          }}
        >
          <LogoutIcon sx={{ mr: 1, color: "red" }} />
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
