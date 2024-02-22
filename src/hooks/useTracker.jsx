import { useEffect, useState } from "react";
import { db, auth } from "../config/Firebase";
import { collection, getAggregateFromServer, sum } from "firebase/firestore";
import useGoals from "./useGoals";

export default function useTracker() {
  const { uid } = auth.currentUser;
  const [total, setNewTotal] = useState();
  const { goal } = useGoals();
  const [remain, setRemain] = useState();

  const sumEntry = async () => {
    const journalCollectionRef = collection(db, "journal/" + uid + "/entries");
    const snapshot = await getAggregateFromServer(journalCollectionRef, {
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

  return { total, remain, sumEntry, updateTotal };
}
