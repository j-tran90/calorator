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
  getDocs,
} from "firebase/firestore";
import useGoals from "./useGoals";

export default function useTracker() {
  const { uid } = auth.currentUser;
  const { calorieTarget, proteinTarget, getDailyCalorieTarget } = useGoals(0);

  const [calorieRemaning, setRemainingCalories] = useState(0);
  const [proteinRemaining, setRemainingProtein] = useState(0);

  const startOfToday = new Date();
  const endOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  endOfToday.setDate(startOfToday.getDate() + 1);

  const entryCollectionRef = query(
    collection(db, "journal", uid, "entries"),
    orderBy("createdAt", "asc"),
    where("createdAt", ">=", startOfToday),
    where("createdAt", "<", endOfToday)
  );

  const [entries, setEntries] = useState([]);
  const [calorieTotal, setNewTotalCals] = useState(0);
  const [proteinTotal, setNewTotalProtein] = useState(0);
  const [sugarTotal, setSugarTotal] = useState(0);
  const [carbsTotal, setCarbsTotal] = useState(0);
  const [fatsTotal, setFatsTotal] = useState(0);
  const [caloriePercent, setCaloriePercent] = useState(0);
  const [proteinPercent, setProteinPercent] = useState(0);

  const fetchEntries = async () => {
    try {
      const querySnapshot = await getDocs(entryCollectionRef);
      const fetchedEntries = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const sumEntry = async () => {
    try {
      const snapshot = await getAggregateFromServer(entryCollectionRef, {
        totalCalories: sum("calories"),
        proteinTotal: sum("protein"),
        sugarTotal: sum("sugar"),
        carbsTotal: sum("carbs"),
        fatsTotal: sum("fats"),
      });
      setNewTotalCals(
        parseFloat(snapshot.data().totalCalories || 0).toFixed(2)
      );
      setNewTotalProtein(
        parseFloat(snapshot.data().proteinTotal || 0).toFixed(2)
      );
      setSugarTotal(parseFloat(snapshot.data().sugarTotal || 0).toFixed(2));
      setCarbsTotal(parseFloat(snapshot.data().carbsTotal || 0).toFixed(2));
      setFatsTotal(parseFloat(snapshot.data().fatsTotal || 0).toFixed(2));
    } catch (error) {
      console.error("Error calculating totals:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
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
    try {
      await deleteDoc(doc(db, "journal", uid, "entries", id));
      await fetchEntries();
      await sumEntry();
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  return {
    calorieTarget,
    proteinTarget,
    calorieTotal,
    proteinTotal,
    sugarTotal,
    carbsTotal,
    fatsTotal,
    calorieRemaning,
    proteinRemaining,
    sumEntry,
    updateTotal,
    entries,
    getDailyCalorieTarget,
    fetchEntries,
    caloriePercent,
    proteinPercent,
    handleDelete,
  };
}
