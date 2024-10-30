import { auth, db, timestamp } from "../config/Firebase";
import useTracker from "../hooks/useTracker";
import { useState } from "react";

export default function useAdd({ sumEntry, updateTotal }) {
  const { entries, total, getEntries } = useTracker(0);
  const { uid } = auth.currentUser;
  const [newEntry, setNewEntry] = useState(0);

  const handleAdd = async (entry, food) => {
    // Add food as a parameter
    setNewEntry(entry);
    await db
      .collection("journal")
      .doc(uid)
      .collection("entries")
      .doc()
      .set({
        calories: parseFloat(newEntry),
        createdAt: timestamp,
        food: food, // Store food name in Firestore
      })
      .then(() => {
        sumEntry();
      })
      .then(() => {
        updateTotal();
      });

    console.log("added", typeof newEntry, newEntry);
  };

  return { handleAdd };
}
