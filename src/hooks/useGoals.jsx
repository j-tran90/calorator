import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/Firebase";

export default function useGoals() {
  const [goal, setGoal] = useState(0);
  const { uid } = auth.currentUser;

  const getGoal = async () => {
    const querySnapshot = await getDoc(doc(db, "goals/" + uid));
    const docSnap = querySnapshot.data().calorieGoal;
    setGoal(docSnap);
  };

  useEffect(() => {
    getGoal();
    console.log("useEffect getGoal", goal);
  }, []);

  return { goal, getGoal };
}
