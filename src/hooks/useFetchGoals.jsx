import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/Firebase";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

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

      if (data) {
        setCalorieTarget(data.dailyCalorieTarget);
        setProteinTarget(data.dailyProteinTarget);
        setTargetDate(data.targetDate);
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

  const SetNewTargetsButton = () =>
    remainingDays === 0 && (
      <Box display='flex' justifyContent='center' mb={3}>
        <Button
          variant='contained'
          component={Link}
          to='/creategoal'
          sx={{
            backgroundColor: "#000",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Set New Target
        </Button>
      </Box>
    );

  return {
    calorieTarget,
    proteinTarget,
    targetDate,
    remainingDays,
    SetNewTargetsButton,
  };
}
