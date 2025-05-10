import React, { useState, useEffect } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import useAdd from "../../hooks/useAdd";

const AddToJournalButton = ({
  calories,
  protein,
  food,
  sugar,
  carbs,
  fats,
  onAdd,
}) => {
  const { handleAdd } = useAdd({ sumEntry: () => {}, updateTotal: () => {} });
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClick = async () => {
    setHasError(false);
    setIsDisabled(true);

    try {
      console.log("Adding entry:", { calories, protein, food }); // Log input data
      await handleAdd(calories, protein, food, sugar, carbs, fats);
      setIsSuccess(true);
      setSnackbarOpen(true); // Open the snackbar on success
      if (onAdd) onAdd();
    } catch (error) {
      console.error("Error in handleAdd:", error); // Log the error
      setHasError(true);
    } finally {
      setIsDisabled(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <>
      <Button
        variant='link'
        onClick={handleClick}
        disabled={isDisabled}
        sx={{
          "&:hover": { backgroundColor: "#9993" },
        }}
      >
        {isSuccess ? (
          <CheckIcon sx={{ color: "#4caf50" }} />
        ) : (
          <AddIcon sx={{ color: "#4caf50" }} />
        )}
        {hasError && (
          <span style={{ color: "red" }}>
            Error occurred. Please try again.
          </span>
        )}
      </Button>

      {/* Snackbar for success confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity='success'
          sx={{ width: "100%" }}
        >
          Entry added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddToJournalButton;
