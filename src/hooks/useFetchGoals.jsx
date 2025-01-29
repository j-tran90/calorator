import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/Firebase";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function useGoals() {
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [proteinTarget, setProteinTarget] = useState(0);
  const [targetDate, setTargetDate] = useState(null);
  const [createdDate, setCreatedDate] = useState(new Date());
  const [differenceInDays, setDifferenceInDays] = useState(null);
  const [remainingDays, setRemainingDays] = useState(0);
  const { uid } = auth.currentUser;

  const fetchUserGoals = async () => {
    try {
      const querySnapshot = await getDoc(doc(db, "userGoals/" + uid));
      const data = querySnapshot.data();

      if (data) {
        setCalorieTarget(data.dailyCalorieTarget);
        setProteinTarget(data.dailyProteinTarget);
        setTargetDate(data.targetDate);
        setCreatedDate(data.createdDate);
      } else {
        console.warn("No user goals found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user goals: ", error);
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
    // Convert both dates to Date objects if they're not already
    const created = new Date(createdDate);
    const target = new Date(targetDate);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = target - created;

    // Convert milliseconds to days and round down to the nearest whole number
    const differenceInDays = Math.ceil(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    return differenceInDays;
  };

  useEffect(() => {
    fetchUserGoals();
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
  };
}
