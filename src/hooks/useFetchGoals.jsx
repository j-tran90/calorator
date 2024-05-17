import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/Firebase";

export default function useGoals() {
  const [calorieTarget, setDailyCalorieTarget] = useState(0);
  const [proteinTarget, setDailyProteinTarget] = useState(0);
  const { uid } = auth.currentUser;

  const getDailyCalorieTarget = async () => {
    const querySnapshot = await getDoc(doc(db, "userGoals/" + uid));
    const docSnap = querySnapshot.data().dailyCalorieTarget;
    setDailyCalorieTarget(docSnap);
    console.log(calorieTarget);
  };

  const getDailyProteinTarget = async () => {
    const querySnapshot = await getDoc(doc(db, "userGoals/" + uid));
    const docSnap = querySnapshot.data().dailyProteinTarget;
    setDailyProteinTarget(docSnap);
    console.log(calorieTarget);
  };

  useEffect(() => {
    getDailyCalorieTarget();
    getDailyProteinTarget();
    console.log("useEffect getGoal", calorieTarget, proteinTarget);
  }, []);

  return {
    calorieTarget,
    getDailyCalorieTarget,
    proteinTarget,
    setDailyProteinTarget,
  };
}
