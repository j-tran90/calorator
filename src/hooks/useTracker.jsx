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
  const { goal, getGoal } = useGoals(0);
  const [remain, setRemain] = useState(0);
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
    console.log("useEffect sumEntry", total);
  }, []);

  const updateTotal = () => {
    const remain = goal - total;
    const percent = parseInt((total / goal) * 100);
    if (remain === goal) {
      setRemain(0);
    } else if (total > goal || total == goal) {
      setPercent(100);
      setRemain(0);
    } else {
      setRemain(remain);
      setPercent(percent);
    }
  };

  useEffect(() => {
    updateTotal();
    console.log("useEffect updateTotal", remain, percent);
  });

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "journal/" + uid + "/entries", id));
    getEntries();
    sumEntry();
  };

  return {
    goal,
    total,
    remain,
    sumEntry,
    updateTotal,
    entries,
    getGoal,
    getEntries,
    percent,
    handleDelete,
  };
}
