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
  const [total, setNewTotal] = useState(0);
  const [percent, setPercent] = useState(0);

  const sumEntry = async () => {
    const snapshot = await getAggregateFromServer(entryCollectionRef, {
      totalCalories: sum("calories"),
    });
    const total = snapshot.data().totalCalories;
    setNewTotal(total);
  };

  useEffect(() => {
    sumEntry();
  }, []);

  const updateTotal = () => {
    const remainingCalories = calorieTarget - total;
    const percent = parseInt((total / calorieTarget) * 100);
    if (remainingCalories === calorieTarget) {
      setRemainingCalories(0);
    } else if (total > calorieTarget || total == calorieTarget) {
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
    total,
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
