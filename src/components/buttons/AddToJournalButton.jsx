import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdd from "../../hooks/useAdd";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

const AddToJournalButton = ({ calories, protein, food, onAdd }) => {
  const navigate = useNavigate();
  const { handleAdd } = useAdd({ sumEntry: () => {}, updateTotal: () => {} });
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = async () => {
    setHasError(false);
    setIsDisabled(true);

    try {
      await handleAdd(calories, protein, food);
      setIsSuccess(true);
      if (onAdd) onAdd();
      navigate("/today");
    } catch (error) {
      setHasError(true);
    } finally {
      setIsDisabled(false);
    }
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
        <span style={{ color: "red" }}>Error occurred. Please try again.</span>
      )}
    </Button>
  );
};

export default AddToJournalButton;
