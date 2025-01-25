import { auth, db, timestamp } from "../config/Firebase";
import useTracker from "../hooks/useTracker";
import { useState } from "react";

export default function useAdd({ sumEntry, updateTotal }) {
  const { entries, totalCals, getEntries } = useTracker(0);
  const { uid } = auth.currentUser;
  const [newEntry, setNewEntry] = useState(0);

  const handleAdd = async (entry, protein, food) => {
    setNewEntry(entry);
    await db
      .collection("journal")
      .doc(uid)
      .collection("entries")
      .doc()
      .set({
        calories: parseFloat(entry),
        protein: protein,
        food: food,
        createdAt: timestamp,
      })
      .then(() => {
        sumEntry();
      })
      .then(() => {
        updateTotal();
      });
    
  };

  return { handleAdd };
}
