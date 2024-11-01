// Sweets.jsx
import React from "react";
import { sweets } from "../data/sweetsData"; // Adjust the path based on your structure
import FoodCategory from "./FoodCategory";

const Sweets = ({ sumEntry, updateTotal }) => {
  return (
    <FoodCategory
      items={sweets}
      sumEntry={sumEntry}
      updateTotal={updateTotal}
    />
  );
};

export default Sweets;
