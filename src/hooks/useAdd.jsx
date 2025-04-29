import { auth, db, timestamp } from "../config/Firebase";
import useTracker from "../hooks/useTracker";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

export default function useAdd({ sumEntry, updateTotal }) {
  const { entries, calorieTotal, getEntries } = useTracker(0);
  const { uid } = auth.currentUser;
  const [newEntry, setNewEntry] = useState(0);

  const handleAdd = async (entry, protein, food, sugar, carbs, fats) => {
    try {
      setNewEntry(entry);

      // Add a new document to the "entries" subcollection
      await addDoc(collection(db, "journal", uid, "entries"), {
        calories: parseFloat(entry),
        protein: parseFloat(protein),
        food: food,
        sugar: parseFloat(sugar),
        carbs: parseFloat(carbs),
        fats: parseFloat(fats),
        createdAt: timestamp(), // Call timestamp() to generate the server timestamp
      });

      // Call the provided functions after successfully adding the entry
      sumEntry();
      updateTotal();
    } catch (error) {
      console.error("Error adding entry to Firestore:", error);
      throw error; // Re-throw the error to handle it in the calling component
    }
  };

  return { handleAdd };
}
