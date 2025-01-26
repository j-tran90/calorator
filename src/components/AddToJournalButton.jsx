import React from "react";
import { useNavigate } from "react-router-dom";
import useAdd from "../hooks/useAdd";
import { Button } from "@mui/material";

const AddToJournalButton = ({ calories, protein, food, onAdd }) => {
  const navigate = useNavigate();
  const { handleAdd } = useAdd({ sumEntry: () => {}, updateTotal: () => {} });

  const handleClick = async () => {
    await handleAdd(calories, protein, food);
    if (onAdd) onAdd();
    navigate("/today");
  };

  return (
    <>
      <Button
        variant='contained'
        onClick={handleClick}
        sx={{
          backgroundColor: "#000",
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        Add
      </Button>
    </>
  );
};

export default AddToJournalButton;
