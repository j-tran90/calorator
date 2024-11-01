import React from "react";
import { vegetables } from "../data/vegetablesData"; // Adjust the path based on your structure
import FoodCategory from "./FoodCategory";

const Vegetables = ({ sumEntry, updateTotal }) => {
  return (
    <FoodCategory
      items={vegetables}
      sumEntry={sumEntry}
      updateTotal={updateTotal}
    />
  );
};

export default Vegetables;
