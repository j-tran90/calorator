import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { auth } from "../config/Firebase";

const db = getFirestore();

export default function useGoals() {
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [proteinTarget, setProteinTarget] = useState(0);
  const [createdDate, setCreateDate] = useState(null);
  const [targetDate, setTargetDate] = useState(null);
  const [remainingDays, setRemainingDays] = useState(0);
  const [differenceInDays, setDifferenceInDays] = useState(0);
  const [calorieTotal, setCalorieTotal] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [weightTarget, setWeightTarget] = useState(0);

  // Function to calculate remaining days
  const calculateRemainingDays = (targetDate) => {
    if (!targetDate) return 0; // If no target date, return 0
    const today = new Date();
    const target = new Date(targetDate);
    const differenceInTime = target - today; // Difference in milliseconds
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    ); // Convert to days
    return differenceInDays > 0 ? differenceInDays : 0; // Return 0 if the target date has passed
  };

  const calculateDifferenceInDays = (createdDate, targetDate) => {
    if (!createdDate || !targetDate) return 0; // Return 0 if either date is missing

    // Convert Firestore Timestamps to JavaScript Date objects if necessary
    const start = createdDate.toDate
      ? createdDate.toDate()
      : new Date(createdDate);
    const target = targetDate.toDate
      ? targetDate.toDate()
      : new Date(targetDate);

    // Calculate the difference in milliseconds
    const differenceInTime = target - start;

    // Convert milliseconds to days
    return Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
  };

  const checkUserData = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is authenticated.");
        return;
      }

      // Fetch the document directly using the UID as the document ID
      const userGoalsRef = doc(db, "userGoals", uid);
      const userGoalsDoc = await getDoc(userGoalsRef);

      if (userGoalsDoc.exists()) {
        const userData = userGoalsDoc.data();

        // Set the fetched fields
        setCalorieTarget(userData.dailyCalorieTarget || 0);
        setProteinTarget(userData.dailyProteinTarget || 0);
        setCreateDate(userData.createdDate || null);
        setTargetDate(userData.targetDate || null);
        setCurrentWeight(userData.currentWeight || 0);
        setWeightTarget(userData.weightTarget || 0);

        // Calculate difference in days and remaining days
        const totalDays = calculateDifferenceInDays(
          userData.createdDate,
          userData.targetDate
        );
        const daysRemaining = calculateRemainingDays(userData.targetDate);

        setDifferenceInDays(totalDays);
        setRemainingDays(daysRemaining);
      } else {
        console.warn("No user goals found for the current user.");
        setCalorieTarget(2000); // Default calorie target
        setProteinTarget(50); // Default protein target
        setCreateDate(null);
        setTargetDate(null);
        setCurrentWeight(0);
        setWeightTarget(0);
        setDifferenceInDays(0); // Default difference in days
        setRemainingDays(0); // Default remaining days
      }
    } catch (error) {
      console.error("Error checking user data:", error);
    }
  };

  useEffect(() => {
    checkUserData();
  }, []);

  return {
    calorieTarget,
    proteinTarget,
    createdDate,
    targetDate,
    remainingDays,
    differenceInDays,
    calorieTotal,
    currentWeight,
    weightTarget,
  };
}
