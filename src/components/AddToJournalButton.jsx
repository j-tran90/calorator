import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdd from "../hooks/useAdd";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

const AddToJournalButton = ({ calories, protein, food, onAdd }) => {
  const navigate = useNavigate();
  const { handleAdd } = useAdd({ sumEntry: () => {}, updateTotal: () => {} });
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleClick = async () => {
    setHasError(false);

    try {
      await handleAdd(calories, protein, food);
      setIsSuccess(true);
      if (onAdd) onAdd();
      navigate("/today");
    } catch (error) {
      setHasError(true);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <Button
      variant='contained'
      onClick={handleClick}
      sx={{
        backgroundColor: "#000",
        "&:hover": { backgroundColor: "#333" },
      }}
    >
      {isSuccess ? (
        <CheckIcon sx={{ color: "#4caf50" }} />
      ) : (
        <AddIcon sx={{ color: "#fff" }} />
      )}
      {hasError && (
        <span style={{ color: "red" }}>Error occurred. Please try again.</span>
      )}
    </Button>
  );
};

export default AddToJournalButton;
