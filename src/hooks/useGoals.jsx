import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { auth } from "../config/Firebase";
import { getData, saveData } from "../utils/indexedDB";

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
  const [programStatus, setProgramStatus] = useState("in progress");

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

      // 1. Try to get cached data from IndexedDB
      const cachedDataObj = await getData(`userGoals-${uid}`);
      const cachedData = cachedDataObj?.data || {};
      const cachedCreatedDate = cachedData.createdDate
        ? new Date(cachedData.createdDate)
        : null;

      // 2. Fetch Firestore doc to check for new data
      const userGoalsRef = doc(db, "userGoals", uid);
      const userGoalsDoc = await getDoc(userGoalsRef);

      if (userGoalsDoc.exists()) {
        const userData = userGoalsDoc.data();
        const firestoreCreatedDate = userData.createdDate
          ? new Date(userData.createdDate)
          : null;

        // If we have cached data and no new data, use cached
        if (
          cachedCreatedDate &&
          firestoreCreatedDate &&
          firestoreCreatedDate.getTime() === cachedCreatedDate.getTime()
        ) {
          setCalorieTarget(cachedData.dailyCalorieTarget || 0);
          setProteinTarget(cachedData.dailyProteinTarget || 0);
          setCreateDate(cachedData.createdDate || null);
          setTargetDate(cachedData.targetDate || null);
          setCurrentWeight(cachedData.currentWeight || 0);
          setWeightTarget(cachedData.weightTarget || 0);
          setProgramStatus(cachedData.programStatus || "in progress");

          const totalDays = calculateDifferenceInDays(
            cachedData.createdDate,
            cachedData.targetDate
          );
          const daysRemaining = calculateRemainingDays(cachedData.targetDate);

          setDifferenceInDays(totalDays);
          setRemainingDays(daysRemaining);
          return;
        }

        // Otherwise, use Firestore data and update IndexedDB
        setCalorieTarget(userData.dailyCalorieTarget || 0);
        setProteinTarget(userData.dailyProteinTarget || 0);
        setCreateDate(userData.createdDate || null);
        setTargetDate(userData.targetDate || null);
        setCurrentWeight(userData.currentWeight || 0);
        setWeightTarget(userData.weightTarget || 0);
        setProgramStatus(userData.status || "in progress");

        const totalDays = calculateDifferenceInDays(
          userData.createdDate,
          userData.targetDate
        );
        const daysRemaining = calculateRemainingDays(userData.targetDate);

        setDifferenceInDays(totalDays);
        setRemainingDays(daysRemaining);

        // Save to IndexedDB
        await saveData(`userGoals-${uid}`, {
          dailyCalorieTarget: userData.dailyCalorieTarget || 0,
          dailyProteinTarget: userData.dailyProteinTarget || 0,
          createdDate: userData.createdDate || null,
          targetDate: userData.targetDate || null,
          currentWeight: userData.currentWeight || 0,
          weightTarget: userData.weightTarget || 0,
          programStatus: userData.status || "in progress",
        });
      } else if (cachedData && cachedData.createdDate) {
        // If Firestore doc doesn't exist but we have cached data
        setCalorieTarget(cachedData.dailyCalorieTarget || 0);
        setProteinTarget(cachedData.dailyProteinTarget || 0);
        setCreateDate(cachedData.createdDate || null);
        setTargetDate(cachedData.targetDate || null);
        setCurrentWeight(cachedData.currentWeight || 0);
        setWeightTarget(cachedData.weightTarget || 0);
        setProgramStatus(cachedData.programStatus || "in progress");

        const totalDays = calculateDifferenceInDays(
          cachedData.createdDate,
          cachedData.targetDate
        );
        const daysRemaining = calculateRemainingDays(cachedData.targetDate);

        setDifferenceInDays(totalDays);
        setRemainingDays(daysRemaining);
      } else {
        // No data found
        console.warn("No user goals found for the current user.");
        setCalorieTarget(2000); // Default calorie target
        setProteinTarget(50); // Default protein target
        setCreateDate(null);
        setTargetDate(null);
        setCurrentWeight(0);
        setWeightTarget(0);
        setDifferenceInDays(0); // Default difference in days
        setRemainingDays(0); // Default remaining days
        setProgramStatus("in progress");
      }
    } catch (error) {
      console.error("Error checking user data:", error);
    }
  };

  useEffect(() => {
    checkUserData();
    // eslint-disable-next-line
  }, []);

  // Determine program type
  let programType = "";
  if (weightTarget > currentWeight) {
    programType = "Gain";
  } else if (weightTarget < currentWeight) {
    programType = "Lose";
  } else {
    programType = "Maintain";
  }

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
    programType,
    programStatus, // <-- Exported here
  };
}
