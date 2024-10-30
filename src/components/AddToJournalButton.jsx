import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useAdd from "../hooks/useAdd";

const AddToJournalButton = ({ calories, food }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { handleAdd } = useAdd({ sumEntry: () => {}, updateTotal: () => {} });

  const handleClick = async () => {
    await handleAdd(calories, food); // Wait for the add operation to complete
    navigate("/dashboard"); // Navigate to the dashboard after adding
  };

  return <button onClick={handleClick}>Add</button>;
};

export default AddToJournalButton;
