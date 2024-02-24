import { useEffect, useState } from "react";
import { db, auth } from "../config/Firebase";
import {
  collection,
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
  const { goal } = useGoals();
  const [remain, setRemain] = useState();
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
  const { data: entries } = useCollectionData(entryCollectionRef);
  const [total, setNewTotal] = useState();

  const sumEntry = async () => {
    const snapshot = await getAggregateFromServer(entryCollectionRef, {
      totalCalories: sum("calories"),
    });
    const total = snapshot.data().totalCalories;
    setNewTotal(total);
    return;
  };

  useEffect(() => {
    sumEntry();
    console.log("useEffect sumEntry", total);
  }, []);

  const updateTotal = async () => {
    const checkProgress = goal - total;
    if (checkProgress < 0) {
      await setRemain(null);
    } else {
      await setRemain(goal - total);
    }
  };

  useEffect(() => {
    updateTotal();
    console.log("useEffect updateTotal", remain);
  });

  return { total, remain, sumEntry, updateTotal, entries };
}
