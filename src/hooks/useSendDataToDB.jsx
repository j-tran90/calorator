import { db, auth } from "../config/Firebase";

const SendDataToDB = async () => {
  const { uid } = auth.currentUser;

  if (!uid) {
    console.error("No user is authenticated.");
    return;
  }

  // Get data from local storage
  const weightGoalData = JSON.parse(localStorage.getItem("weightGoal")) || {};
  const calorieData = JSON.parse(localStorage.getItem("calorieData")) || {};
  const resultsData = JSON.parse(localStorage.getItem("resultsData")) || {};

  // Data for userProfile collection
  const userProfileData = {
    age: parseInt(calorieData.age) || 0,
    height: parseFloat(calorieData.height) || 0,
    currentWeight: parseFloat(calorieData.weight) || 0,
    gender: calorieData.gender || "",
  };

  // Data for userGoal collection
  const userGoalData = {
    weightTarget: weightGoalData.weightTarget || "",
    targetDate: weightGoalData.targetDate || "",
    // Include data from resultsData
    dailyCalorieTarget: resultsData.dailyCalorieTarget || "",
    dailyProteinTarget: resultsData.dailyProteinTarget || "",
  };

  console.log("Sending data to Firestore:");
  console.log("userProfileData:", userProfileData);
  console.log("userGoalData:", userGoalData);

  // Send data to Firestore
  try {
    await db.collection("userProfile").doc(uid).set(userProfileData);
    await db.collection("userGoals").doc(uid).set(userGoalData);

    console.log("Data successfully written to Firestore");

    // Clear local storage after sending data
    localStorage.removeItem("weightGoal");
    localStorage.removeItem("calorieData");
    localStorage.removeItem("resultsData"); // Remove resultsData after sending
  } catch (error) {
    console.error("Error writing document: ", error);
  }
};

export default SendDataToDB;
