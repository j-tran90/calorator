import { db, auth } from "../config/Firebase";
import dayjs from "dayjs";

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

  // Current timestamp
  const currentDate = new Date().toISOString(); // Format: YYYY-MM-DDTHH:mm:ss.sssZ



  // Data for userProfile collection
  const userProfileData = {
    dob: calorieData.dateOfBirth || "", // Ensure dob is being passed correctly
    height: parseFloat(calorieData.height) || 0,
    currentWeight: parseFloat(calorieData.weight) || 0,
    gender: calorieData.gender || "",
    createdDate: currentDate, // Add creation date
  };

  // Data for userGoal collection
  const userGoalData = {
    weightTarget: weightGoalData.weightTarget || "",
    targetDate: weightGoalData.targetDate || "",
    dailyCalorieTarget: resultsData.dailyCalorieTarget || "",
    dailyProteinTarget: resultsData.dailyProteinTarget || "",
    createdDate: currentDate, // Add creation date
    status: "in progress", // Default to "in progress" for the current goal
  };

  console.log("Sending data to Firestore:");
  console.log("userProfileData:", userProfileData);
  console.log("userGoalData:", userGoalData);

  try {
    // Save to userProfile collection
    await db.collection("userProfile").doc(uid).set(userProfileData);

    // Update the status of previous goals in goalsHistory to "completed"
    const goalsHistoryRef = db.collection("userGoals").doc(uid).collection("goalsHistory");
    const snapshot = await goalsHistoryRef.get();

    snapshot.forEach(async (doc) => {
      await goalsHistoryRef.doc(doc.id).update({ status: "completed" });
    });

    // Add the current goal to the goalsHistory subcollection with "in progress"
    await goalsHistoryRef.add(userGoalData);

    // Add current goal to userGoals collection as the most recent one
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
