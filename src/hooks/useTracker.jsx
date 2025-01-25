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
  const { calorieTarget, getDailyCalorieTarget } = useFetchGoals(0);
  const [remainingCalories, setRemainingCalories] = useState(0);
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
  const [totalCals, setNewTotalCals] = useState(0);
  const [totalProtein, setNewTotalProtein] = useState(0);
  const [percent, setPercent] = useState(0);

  const sumEntry = async () => {
    const snapshot = await getAggregateFromServer(entryCollectionRef, {
      totalCalories: sum("calories"),
      totalProtein: sum("protein"),
    });
    const totalCals = snapshot.data().totalCalories;
    setNewTotalCals(totalCals);
    const totalProtein = snapshot.data().totalProtein;
    setNewTotalProtein(totalProtein);
  };

  useEffect(() => {
    sumEntry();
  }, []);

  const updateTotal = () => {
    const remainingCalories = calorieTarget - totalCals;
    const percent = parseInt((totalCals / calorieTarget) * 100);
    if (remainingCalories === calorieTarget) {
      setRemainingCalories(0);
    } else if (totalCals > calorieTarget || totalCals == calorieTarget) {
      setPercent(100);
      setRemainingCalories(0);
    } else {
      setRemainingCalories(remainingCalories);
      setPercent(percent);
    }
  };

  useEffect(() => {
    updateTotal();
  });

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "journal/" + uid + "/entries", id));
    getEntries();
    sumEntry();
  };

  return {
    calorieTarget,
    totalCals,
    totalProtein,
    remainingCalories,
    sumEntry,
    updateTotal,
    entries,
    getDailyCalorieTarget,
    getEntries,
    percent,
    handleDelete,
  };
}
