import React from "react";
import { useNavigate } from "react-router-dom";
import useAdd from "../hooks/useAdd";

const AddToJournalButton = ({ calories, protein, food, onAdd }) => {
  // Add onAdd prop
  const navigate = useNavigate();
  const { handleAdd } = useAdd({ sumEntry: () => {}, updateTotal: () => {} });

  const handleClick = async () => {
    await handleAdd(calories, protein, food);
    if (onAdd) onAdd();
    navigate("/today");
  };

  return <button onClick={handleClick}>Add</button>;
};

export default AddToJournalButton;
