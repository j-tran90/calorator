import React from "react";
import { dairy } from "../data/dairyData"; // Adjust the path based on your structure
import FoodCategory from "./FoodCategory";

const Dairy = ({ sumEntry, updateTotal }) => {
  return (
    <FoodCategory items={dairy} sumEntry={sumEntry} updateTotal={updateTotal} />
  );
};

export default Dairy;
