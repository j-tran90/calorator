import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/Firebase";

export default function useGoals() {
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [proteinTarget, setProteinTarget] = useState(0);
  const [targetDate, setTargetDate] = useState(null);
  const [remainingDays, setRemainingDays] = useState(0);
  const { uid } = auth.currentUser;

  const fetchUserGoals = async () => {
    try {
      const querySnapshot = await getDoc(doc(db, "userGoals/" + uid));
      const data = querySnapshot.data();

      setCalorieTarget(data.dailyCalorieTarget);
      setProteinTarget(data.dailyProteinTarget);
      setTargetDate(data.targetDate);
    } catch (error) {
      console.error("Error fetching user goals: ", error);
    }
  };

  const calculateRemainingDays = () => {
    if (targetDate) {
      const currentDate = new Date();
      const targetDateObj = new Date(targetDate);
      const timeDifference = targetDateObj - currentDate;
      const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
      setRemainingDays(daysRemaining);
    }
  };

  useEffect(() => {
    fetchUserGoals();
  }, []);

  useEffect(() => {
    calculateRemainingDays();
  }, [targetDate]);

  return {
    calorieTarget,
    proteinTarget,
    remainingDays,
  };
}
