import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

function Results() {
  const [weightTarget, setWeightTarget] = useState("");
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
    const savedData = JSON.parse(localStorage.getItem("calorieData"));
    if (savedData) {
      console.log("Retrieved data from localStorage:", savedData);
      const formattedDob = dayjs(savedData.dateOfBirth).format("YYYY-MM-DD"); // Format the DOB
      setDob(formattedDob); // Now use the formatted DOB
    } else {
      console.log("No data found in localStorage.");
    }
  }, []);

  // Effect to calculate remaining days and other data
  useEffect(() => {
    const weightGoalData = JSON.parse(localStorage.getItem("weightGoal")) || {};
    const calorieData = JSON.parse(localStorage.getItem("calorieData")) || {};

    if (calorieData.dob) {
      setDob(calorieData.dob); // Store the dob from localStorage
    } else {
      console.error("DOB not found in localStorage:", calorieData.dob);
    }

    setWeightTarget(weightGoalData.weightTarget);
    setHeight(calorieData.height);
    setCurrentWeight(calorieData.weight);
    setGender(calorieData.gender);

    if (!weightTarget || !currentWeight) return;

    // Convert weightTarget and currentWeight to kg
    const weightTargetKg = weightTarget * 0.453592; // Convert weight target from lbs to kg
    const currentWeightKg = currentWeight * 0.453592; // Convert current weight from lbs to kg
    const weightDifference = weightTargetKg - currentWeightKg;

    // Convert weightTarget to a Date object
    const targetDate = new Date(weightGoalData.targetDate);

    // Capture user's system time
    const currentDate = new Date();

    // Calculate remaining days
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));

    // Handle edge cases where remainingDays might be invalid
    setRemainingDays(daysRemaining > 0 ? daysRemaining : 0);

    // Ensure dob is valid before proceeding
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
      console.error("Invalid DOB:", dob); // Log error for invalid DOB
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
        1.2 * (10 * currentWeightKg + 6.25 * height - 5 * ageInYears - 161);
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

    // Save data into local storage
    const dataToSave = {
      weightGoal: weightTarget,
      remainingDays: daysRemaining,
      dailyCalorieTarget: calculatedDailyCalorieTarget,
      dailyProteinTarget: calculatedDailyProteinTarget,
    };
    localStorage.setItem("resultsData", JSON.stringify(dataToSave));
  }, [weightTarget, currentWeight, dob, height]);

  return (
    <div>
      <p>Weight Goal: {weightTarget}</p>
      <p>Remaining Days: {remainingDays}</p>
      <p>Age: {age} years</p> {/* Display the calculated age */}
      <p>Daily Calorie Target: {dailyCalorieTarget} kcal</p>
      <p>Daily Protein Target: {dailyProteinTarget} g</p>
    </div>
  );
}

export default Results;
