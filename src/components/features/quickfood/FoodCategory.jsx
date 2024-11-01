import React from "react";
import Button from "@mui/material/Button";
import { db, auth, timestamp } from "../../../config/Firebase";

const FoodCategory = ({ items, sumEntry, updateTotal }) => {
  const addToJournal = async (kcal, name) => {
    const uid = auth.currentUser.uid;

    try {
      await db.collection("journal").doc(uid).collection("entries").doc().set({
        calories: kcal,
        food: name,
        createdAt: timestamp,
      });

      sumEntry(); // Update the sum of entries
      updateTotal(); // Update the total calories
    } catch (error) {
      console.error("Error adding entry to journal:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "center",
      }}
    >
      {items.map((item) => (
        <Button
          key={item.id}
          variant='contained'
          onClick={() => addToJournal(item.kcal, item.name)}
          startIcon={item.icon}
          style={{
            minWidth: "120px",
            display: "flex",
            flexDirection: "column",
            fontSize: "12px",
            backgroundColor: "#4fc483",
          }}
        >
          {item.name} +{item.kcal} kcal
        </Button>
      ))}
    </div>
  );
};

export default FoodCategory;
