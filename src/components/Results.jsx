import React, { useEffect, useState } from "react";

function Results() {
  const [weightTarget, setWeightTarget] = useState("");
  const [remainingDays, setRemainingDays] = useState(0);
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [gender, setGender] = useState("");
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(0);
  const [dailyProteinTarget, setDailyProteinTarget] = useState(0);

  useEffect(() => {
    // Read data from local storage
    const weightGoalData = JSON.parse(localStorage.getItem("weightGoal")) || {};
    const calorieData = JSON.parse(localStorage.getItem("calorieData")) || {};

    // Set state with retrieved data
    setWeightTarget(weightGoalData.weightTarget);
    setAge(calorieData.age);
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
    setRemainingDays(daysRemaining);

    // Calculate daily calorie target
    const calorieDeficitPerDay = 7700; // 1 kg of body weight loss ≈ 7700 kcal

    let dailyCalorieTargetCalculation = 0;
    if (daysRemaining !== 0) {
      dailyCalorieTargetCalculation =
        (weightDifference * calorieDeficitPerDay) / daysRemaining +
        1.2 * (10 * currentWeightKg + 6.25 * height - 5 * age - 161);
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

    // Log the saved resultsData
    console.log("Saved resultsData:", dataToSave);
  }, [weightTarget, currentWeight, age, height]);

  return (
    <div>
      <p>Weight Goal: {weightTarget}</p>
      <p>Remaining Days: {remainingDays}</p>
      <p>Daily Calorie Target: {dailyCalorieTarget} kcal</p>
      <p>Daily Protein Target: {dailyProteinTarget} g</p>
    </div>
  );
}

export default Results;
