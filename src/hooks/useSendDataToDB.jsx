import { db, auth } from "../config/Firebase";
import dayjs from "dayjs";

const SendDataToDB = async () => {
  const { uid } = auth.currentUser || {};

  if (!uid) {
    console.error("No user is authenticated.");
    return;
  }

  const weightGoalData = JSON.parse(localStorage.getItem("weightGoal")) || {};
  const calorieData = JSON.parse(localStorage.getItem("calorieData")) || {};
  const resultsData = JSON.parse(localStorage.getItem("resultsData")) || {};
  const currentDate = new Date().toISOString();

  const userProfileData = {
    dob: calorieData.dob || "",
    height: parseFloat(calorieData.height) || 0,
    currentWeight: parseFloat(calorieData.weight) || 0,
    gender: calorieData.gender || "",
    createdDate: currentDate,
  };

  const userGoalData = {
    weightTarget: weightGoalData.weightTarget || "",
    targetDate: weightGoalData.targetDate || "",
    dailyCalorieTarget: resultsData.dailyCalorieTarget || 0,
    dailyProteinTarget: resultsData.dailyProteinTarget || 0,
    createdDate: currentDate,
    status: "in progress",
  };

  try {
    console.log("Sending data to Firestore...");
    const batch = db.batch();

    // Update user profile
    const userProfileRef = db.collection("userProfile").doc(uid);
    batch.set(userProfileRef, userProfileData);

    // Update user goals and goal history
    const userGoalsRef = db.collection("userGoals").doc(uid);
    batch.set(userGoalsRef, userGoalData);

    const goalsHistoryRef = db
      .collection("userGoals")
      .doc(uid)
      .collection("goalsHistory");
    const snapshot = await goalsHistoryRef.get();
    snapshot.forEach((doc) => {
      const docRef = goalsHistoryRef.doc(doc.id);
      batch.update(docRef, { status: "completed" });
    });

    // Add new goal to goals history
    const newGoalRef = goalsHistoryRef.doc();
    batch.set(newGoalRef, userGoalData);

    await batch.commit();

    console.log("Data successfully written to Firestore.");
    localStorage.removeItem("weightGoal");
    localStorage.removeItem("calorieData");
    localStorage.removeItem("resultsData");
  } catch (error) {
    console.error("Error writing data to Firestore:", error);
  }
};

export default SendDataToDB;
