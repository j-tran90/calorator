import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
} from "@mui/material";
import { getData, saveData } from "../../../utils/indexedDB"; // Already using idb helpers

function Results() {
  const [weightTarget, setWeightTarget] = useState("");
  const [targetDate, setTargetDate] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [dob, setDob] = useState(""); // Date of Birth instead of age
  const [height, setHeight] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [gender, setGender] = useState("");
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(0);
  const [dailyProteinTarget, setDailyProteinTarget] = useState(0);
  const [age, setAge] = useState(0); // Calculated age in years

  // Effect to handle dob and calculate age
  useEffect(() => {
    // Fetch from IndexedDB
    const fetchData = async () => {
      const calorieDataObj = await getData("calorieData");
      const calorieData = calorieDataObj?.data || {};
      if (calorieData.dob) {
        setDob(calorieData.dob); // Store as ISO for calculations
      } else {
        setDob("");
      }
    };
    fetchData();
  }, []);

  // Effect to calculate remaining days and other data
  useEffect(() => {
    const fetchAndCalculate = async () => {
      const weightGoalObj = await getData("weightGoal");
      const calorieDataObj = await getData("calorieData");
      const weightGoalData = weightGoalObj?.data || {};
      const calorieData = calorieDataObj?.data || {};

      if (calorieData.dob) {
        setDob(calorieData.dob);
      }

      setWeightTarget(weightGoalData.weightTarget);
      setHeight(calorieData.height);
      setCurrentWeight(weightGoalData.currentWeight);
      setGender(calorieData.gender);

      if (!weightGoalData.weightTarget || !weightGoalData.currentWeight) return;

      // Convert weightTarget and currentWeight to kg
      const weightTargetKg = weightGoalData.weightTarget * 0.453592;
      const currentWeightKg = weightGoalData.currentWeight * 0.453592;
      const weightDifference = weightTargetKg - currentWeightKg;

      // Convert weightTarget to a Date object
      const targetDateObj = new Date(weightGoalData.targetDate);
      setTargetDate(targetDateObj);

      // Capture user's system time
      const currentDate = new Date();

      // Calculate remaining days
      const timeDifference = targetDateObj.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
      setRemainingDays(daysRemaining > 0 ? daysRemaining : 0);

      // Ensure dob is valid before proceeding
      const birthDate = new Date(calorieData.dob);
      if (isNaN(birthDate.getTime())) {
        setAge(0);
        return;
      }

      // Calculate age in years
      const ageInMilliseconds = currentDate - birthDate;
      const ageInYears = Math.floor(
        ageInMilliseconds / (1000 * 3600 * 24 * 365.25)
      );
      setAge(ageInYears);

      // Calculate daily calorie target
      const calorieDeficitPerDay = 7700; // 1 kg of body weight loss ≈ 7700 kcal

      let dailyCalorieTargetCalculation = 0;
      if (weightDifference !== 0 && daysRemaining > 0 && !isNaN(ageInYears)) {
        dailyCalorieTargetCalculation =
          (weightDifference * calorieDeficitPerDay) / daysRemaining +
          1.2 * (10 * currentWeightKg + 6.25 * calorieData.height - 5 * ageInYears - 161);
      }

      const calculatedDailyCalorieTarget = isNaN(dailyCalorieTargetCalculation)
        ? 0
        : Math.floor(dailyCalorieTargetCalculation);
      setDailyCalorieTarget(calculatedDailyCalorieTarget);

      // Calculate daily protein target
      const dailyProteinTargetCalculation = 0.8 * currentWeightKg;
      const calculatedDailyProteinTarget = Math.floor(
        dailyProteinTargetCalculation
      );
      setDailyProteinTarget(calculatedDailyProteinTarget);

      // Save data into IndexedDB
      const dataToSave = {
        weightGoal: weightGoalData.weightTarget,
        remainingDays: daysRemaining,
        dailyCalorieTarget: calculatedDailyCalorieTarget,
        dailyProteinTarget: calculatedDailyProteinTarget,
      };
      await saveData("resultsData", dataToSave);
    };

    fetchAndCalculate();
  }, [weightTarget, currentWeight, dob, height]);

  // Determine program plan
  let programPlan = "";
  if (weightTarget > currentWeight) {
    programPlan = "Gain";
  } else if (weightTarget < currentWeight) {
    programPlan = "Loss";
  } else {
    programPlan = "Maintain";
  }

  const formatDate = (date) => {
    return dayjs(date).format("MMM DD, YYYY");
  };

  return (
    <Box component={Paper} sx={{borderRadius: "20px", p: {xxs: 1, md: 3}}}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='left'>Goal</TableCell>
              <TableCell align='left'>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align='left'>Weight Goal</TableCell>
              <TableCell align='left'>
                <strong>{weightTarget} lbs</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Program Plan</TableCell>
              <TableCell align='left'>
                <strong>Weight {programPlan}</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Daily Calorie Target</TableCell>
              <TableCell align='left'>
                <strong>{dailyCalorieTarget} kcal</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Daily Protein Target</TableCell>
              <TableCell align='left'>
                <strong>{dailyProteinTarget} g</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Reach Goal By</TableCell>
              <TableCell align='left'>
                <strong>{formatDate(targetDate)}</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='left'>Remaining Days</TableCell>
              <TableCell align='left'>
                <strong>{remainingDays}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Results;
