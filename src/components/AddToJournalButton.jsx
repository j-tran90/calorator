import React from "react";
import { useNavigate } from "react-router-dom";
import useAdd from "../hooks/useAdd";

const AddToJournalButton = ({ calories, food, onAdd }) => {
  // Add onAdd prop
  const navigate = useNavigate();
  const { handleAdd } = useAdd({ sumEntry: () => {}, updateTotal: () => {} });

  const handleClick = async () => {
    await handleAdd(calories, food);
    if (onAdd) onAdd(); // Call onAdd to trigger a state update in the parent
    navigate("/dashboard");
  };

  return <button onClick={handleClick}>Add</button>;
};

export default AddToJournalButton;
