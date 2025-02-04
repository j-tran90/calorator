import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/Firebase";

export default function useGoals() {
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [proteinTarget, setProteinTarget] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [weightTarget, setWeightTarget] = useState(0);
  const [targetDate, setTargetDate] = useState(null);
  const [createdDate, setCreatedDate] = useState(new Date());
  const [differenceInDays, setDifferenceInDays] = useState(null);
  const [remainingDays, setRemainingDays] = useState(0);
  const { uid } = auth.currentUser;

  // Fetch user goals from localStorage first, fallback to Firestore if not available
  const loadGoalsFromLocalStorage = () => {
    const storedGoals = localStorage.getItem("userGoals");
    if (storedGoals) {
      console.log("Data fetched from localStorage"); // Log when data is loaded from localStorage
      const goalsData = JSON.parse(storedGoals);
      setCalorieTarget(goalsData.dailyCalorieTarget);
      setProteinTarget(goalsData.dailyProteinTarget);
      setTargetDate(goalsData.targetDate);
      setCreatedDate(goalsData.createdDate);
      setCurrentWeight(goalsData.currentWeight);
      setWeightTarget(goalsData.weightTarget);
    } else {
      console.log("No data found in localStorage, fetching from Firestore"); // Log if localStorage is empty
      fetchUserGoalsFromFirestore();
    }
  };

  // Fetch user goals from Firestore
  const fetchUserGoalsFromFirestore = async () => {
    try {
      const querySnapshot = await getDoc(doc(db, "userGoals/" + uid));
      const data = querySnapshot.data();

      if (data) {
        console.log("Data fetched from Firestore"); // Log when data is loaded from Firestore
        // Save the data in localStorage for future use
        localStorage.setItem("userGoals", JSON.stringify(data));

        setCalorieTarget(data.dailyCalorieTarget);
        setProteinTarget(data.dailyProteinTarget);
        setTargetDate(data.targetDate);
        setCreatedDate(data.createdDate);
        setCurrentWeight(data.currentWeight);
        setWeightTarget(data.weightTarget);
      } else {
        console.warn("No user goals found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user goals from Firestore: ", error);
    }
  };

  const calculateRemainingDays = (targetDate) => {
    if (targetDate) {
      const currentDate = new Date();
      const targetDateObj = new Date(targetDate);

      // Reset time portions to 00:00:00 for accurate day comparison
      currentDate.setHours(0, 0, 0, 0);
      targetDateObj.setHours(0, 0, 0, 0);

      const timeDifference = targetDateObj - currentDate;
      const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days

      return daysRemaining > 0 ? daysRemaining : 0; // Ensure no negative days
    }
    return 0;
  };

  const calculateTargetLength = (createdDate, targetDate) => {
    const created = new Date(createdDate);
    const target = new Date(targetDate);

    const differenceInMilliseconds = target - created;
    const differenceInDays = Math.ceil(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    return differenceInDays;
  };

  const programType =
    currentWeight > weightTarget
      ? "Weight Loss"
      : currentWeight < weightTarget
      ? "Weight Gain"
      : currentWeight === weightTarget
      ? "Weight Maintain"
      : "None";

  useEffect(() => {
    loadGoalsFromLocalStorage(); // Check and load goals from localStorage first
  }, []);

  // Recalculate remaining days whenever the targetDate changes
  useEffect(() => {
    if (targetDate) {
      const days = calculateRemainingDays(targetDate);
      setRemainingDays(days);
    }
  }, [targetDate]);

  useEffect(() => {
    if (targetDate && createdDate) {
      const dayLength = calculateTargetLength(createdDate, targetDate);
      setDifferenceInDays(dayLength); // Set the value to differenceInDays
    }
  }, [targetDate, createdDate]);

  return {
    calorieTarget,
    proteinTarget,
    targetDate,
    remainingDays,
    createdDate,
    differenceInDays,
    currentWeight,
    weightTarget,
    programType,
  };
}
