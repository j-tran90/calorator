import { useEffect, useState } from "react";
import { db, auth } from "../config/Firebase";
import {
  collection,
  deleteDoc,
  doc,
  getAggregateFromServer,
  orderBy,
  query,
  sum,
  where,
} from "firebase/firestore";
import useFetchGoals from "./useFetchGoals";
import useCollectionData from "./useFetch";

export default function useTracker() {
  const { uid } = auth.currentUser;
  const { calorieTarget, getDailyCalorieTarget, proteinTarget } =
    useFetchGoals(0); // Assuming proteinTarget is also fetched
  const [calorieRemaning, setRemainingCalories] = useState(0);
  const [proteinRemaining, setRemainingProtein] = useState(0); // For protein tracking
  const startOfToday = new Date();
  const endOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  endOfToday.setDate(startOfToday.getDate() + 1);
  const entryCollectionRef = query(
    collection(db, "journal/" + uid + "/entries"),
    orderBy("createdAt", "asc"),
    where("createdAt", ">=", startOfToday),
    where("createdAt", "<", endOfToday)
  );
  const { data: entries, getData: getEntries } =
    useCollectionData(entryCollectionRef);
  const [calorieTotal, setNewTotalCals] = useState(0);
  const [proteinTotal, setNewTotalProtein] = useState(0);
  const [caloriePercent, setCaloriePercent] = useState(0);
  const [proteinPercent, setProteinPercent] = useState(0); // For protein percent tracking

  const sumEntry = async () => {
    const snapshot = await getAggregateFromServer(entryCollectionRef, {
      totalCalories: sum("calories"),
      proteinTotal: sum("protein"),
    });
    const calorieTotal = snapshot.data().totalCalories;
    const proteinTotal = snapshot.data().proteinTotal;
    setNewTotalCals(calorieTotal);
    setNewTotalProtein(proteinTotal);
  };

  useEffect(() => {
    sumEntry();
  }, []);

  // Dynamic function for updating both calorie and protein percent
  const updateTotal = (total, target, setPercent, setRemaining) => {
    const remaining = target - total;
    const percent = parseInt((total / target) * 100);

    if (remaining === target) {
      setRemaining(0);
    } else if (total > target || total === target) {
      setPercent(100);
      setRemaining(0);
    } else {
      setRemaining(remaining);
      setPercent(percent);
    }
  };

  useEffect(() => {
    updateTotal(
      calorieTotal,
      calorieTarget,
      setCaloriePercent,
      setRemainingCalories
    );
    updateTotal(
      proteinTotal,
      proteinTarget,
      setProteinPercent,
      setRemainingProtein
    );
  }, [calorieTotal, proteinTotal, calorieTarget, proteinTarget]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "journal/" + uid + "/entries", id));
    getEntries();
    sumEntry();
  };

  return {
    calorieTarget,
    proteinTarget, // Returning the protein target
    calorieTotal,
    proteinTotal,
    calorieRemaning,
    proteinRemaining, // Returning the remaining protein
    sumEntry,
    updateTotal,
    entries,
    getDailyCalorieTarget,
    getEntries,
    caloriePercent,
    proteinPercent, // Returning the protein percent
    handleDelete,
  };
}
