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
import useGoals from "./useGoals";
import useCollectionData from "./useFetch";

export default function useTracker() {
  const { uid } = auth.currentUser;
  const { calorieTarget, proteinTarget, getDailyCalorieTarget } = useGoals(0);

  const [calorieRemaning, setRemainingCalories] = useState(0);
  const [proteinRemaining, setRemainingProtein] = useState(0);

  const startOfToday = new Date();
  const endOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  endOfToday.setDate(startOfToday.getDate() + 1);

  // Query userProfiles collection to fetch currentWeight and targetWeight

  const entryCollectionRef = query(
    collection(db, "journal", uid, "entries"),
    orderBy("createdAt", "asc"),
    where("createdAt", ">=", startOfToday),
    where("createdAt", "<", endOfToday)
  );

  const { data: entries, getData: getEntries } =
    useCollectionData(entryCollectionRef);

  const [calorieTotal, setNewTotalCals] = useState(0);
  const [proteinTotal, setNewTotalProtein] = useState(0);
  const [caloriePercent, setCaloriePercent] = useState(0);
  const [proteinPercent, setProteinPercent] = useState(0);

  const sumEntry = async () => {
    const snapshot = await getAggregateFromServer(entryCollectionRef, {
      totalCalories: sum("calories"),
      proteinTotal: sum("protein"),
    });
    setNewTotalCals(snapshot.data().totalCalories || 0);
    setNewTotalProtein(snapshot.data().proteinTotal || 0);
  };

  useEffect(() => {
    sumEntry();
  }, []);

  const updateTotal = (total, target, setPercent, setRemaining) => {
    if (target && total !== undefined) {
      const remaining = target - total;
      const percent = Math.round((total / target) * 100);

      if (remaining === target) {
        setRemaining(0);
      } else if (total >= target) {
        setPercent(100);
        setRemaining(0);
      } else {
        setRemaining(remaining);
        setPercent(percent);
      }
    }
  };

  useEffect(() => {
    if (calorieTarget && proteinTarget) {
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
    }
  }, [calorieTotal, proteinTotal, calorieTarget, proteinTarget]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "journal", uid, "entries", id));
    getEntries();
    sumEntry();
  };

  return {
    calorieTarget,
    proteinTarget,
    calorieTotal,
    proteinTotal,
    calorieRemaning,
    proteinRemaining,
    sumEntry,
    updateTotal,
    entries,
    getDailyCalorieTarget,
    getEntries,
    caloriePercent,
    proteinPercent,
    handleDelete,
  };
}
