import React from "react";
import { beverages } from "../data/beveragesData"; // Adjust the path based on your structure
import FoodCategory from "./FoodCategory";

const Beverages = ({ sumEntry, updateTotal }) => {
  return (
    <FoodCategory
      items={beverages}
      sumEntry={sumEntry}
      updateTotal={updateTotal}
    />
  );
};

export default Beverages;
