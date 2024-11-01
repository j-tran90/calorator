import React from "react";
import { grains } from "../data/grainsData"; // Adjust the path based on your structure
import FoodCategory from "./FoodCategory";

const Grains = ({ sumEntry, updateTotal }) => {
  return (
    <FoodCategory
      items={grains}
      sumEntry={sumEntry}
      updateTotal={updateTotal}
    />
  );
};

export default Grains;
