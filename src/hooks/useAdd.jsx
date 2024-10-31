import { auth, db, timestamp } from "../config/Firebase";
import useTracker from "../hooks/useTracker";
import { useState } from "react";

export default function useAdd({ sumEntry, updateTotal }) {
  const { entries, total, getEntries } = useTracker(0);
  const { uid } = auth.currentUser;
  const [newEntry, setNewEntry] = useState(0);

  const handleAdd = async (entry, food) => {
    setNewEntry(entry);
    await db
      .collection("journal")
      .doc(uid)
      .collection("entries")
      .doc()
      .set({
        calories: parseFloat(entry), // Ensure entry is parsed to float
        food: food, // Add the food name to the entry
        createdAt: timestamp,
      })
      .then(() => {
        sumEntry(); // Call sumEntry to update totals if necessary
      })
      .then(() => {
        updateTotal(); // Update the total if necessary
      });

    console.log("added", typeof newEntry, newEntry); // Log for debugging
  };

  return { handleAdd };
}
