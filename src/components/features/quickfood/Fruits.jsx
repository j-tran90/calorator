import React from "react";
import { fruits } from "../data/fruitsData"; // Adjust the path based on your structure
import FoodCategory from "./FoodCategory";

const Fruits = ({ sumEntry, updateTotal }) => {
  return (
    <FoodCategory
      items={fruits}
      sumEntry={sumEntry}
      updateTotal={updateTotal}
    />
  );
};

export default Fruits;
