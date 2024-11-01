import React from "react";
import { meats } from "../data/meatsData"; // Adjust the path based on your structure
import FoodCategory from "./FoodCategory";

const Meats = ({ sumEntry, updateTotal }) => {
  return (
    <FoodCategory items={meats} sumEntry={sumEntry} updateTotal={updateTotal} />
  );
};

export default Meats;
