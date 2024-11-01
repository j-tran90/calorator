import React from "react";
import Button from "@mui/material/Button";
import AppleIcon from "@mui/icons-material/Apple";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage"; // Placeholder for Banana
import OrangeIcon from "@mui/icons-material/EmojiNature";
import StrawberryIcon from "@mui/icons-material/LocalFlorist"; // Placeholder for Strawberry
import WineBarIcon from "@mui/icons-material/WineBar"; // Placeholder for Grape
import { db, auth } from "../../../config/Firebase";
import { doc, setDoc } from "firebase/firestore";

// Define fruit data with MUI icons and colors
const fruits = [
  {
    id: 168,
    name: "Apple",
    kcal: 52,
    icon: <AppleIcon style={{ color: "red" }} />,
  },
  {
    id: 171,
    name: "Banana",
    kcal: 89,
    icon: <EmojiFoodBeverageIcon style={{ color: "#FFD700" }} />,
  }, // Yellow
  {
    id: 174,
    name: "Orange",
    kcal: 47,
    icon: <OrangeIcon style={{ color: "orange" }} />,
  },
  {
    id: 202,
    name: "Strawberry",
    kcal: 32,
    icon: <StrawberryIcon style={{ color: "#FF69B4" }} />,
  }, // Pinkish-red
  {
    id: 217,
    name: "Grape",
    kcal: 69,
    icon: <WineBarIcon style={{ color: "purple" }} />,
  },
];

const Fruits = ({ updateTotal }) => {
  // Function to add fruit data to the journal in Firebase
  const addToJournal = async (kcal, name) => {
    const uid = auth.currentUser.uid;
    const entryRef = doc(
      db,
      "journal/" + uid + "/entries",
      Date.now().toString()
    );

    try {
      await setDoc(entryRef, {
        calories: kcal,
        food: name,
        createdAt: new Date(),
      });
      console.log(`${name} added to journal with ${kcal} kcal.`);
      updateTotal();
    } catch (error) {
      console.error("Error adding to journal: ", error);
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
      {fruits.map((fruit) => (
        <Button
          key={fruit.id}
          variant='contained'
          onClick={() => addToJournal(fruit.kcal, fruit.name)}
          startIcon={fruit.icon}
          style={{
            minWidth: "120px",
            display: "flex",
            flexDirection: "column",
            fontSize: "12px",
            backgroundColor: "#4fc483",
          }}
        >
          {fruit.name} +{fruit.kcal} kcal
        </Button>
      ))}
    </div>
  );
};

export default Fruits;
