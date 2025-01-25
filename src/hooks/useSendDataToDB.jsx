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

  const userGoalData = {
    currentWeight: parseFloat(weightGoalData.currentWeight) || 0,
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

    // Check if user profile already exists
    const userProfileRef = db.collection("userProfile").doc(uid);
    const userProfileDoc = await userProfileRef.get();

    // If the profile exists, do not overwrite existing fields
    const userProfileData = {
      dob: calorieData.dob || userProfileDoc.data()?.dob || "",
      height: parseFloat(calorieData.height) || userProfileDoc.data()?.height || 0,
      gender: calorieData.gender || userProfileDoc.data()?.gender || "",
      joinDate: userProfileDoc.exists ? userProfileDoc.data()?.joinDate : currentDate, // Only set joinDate if the profile doesn't exist
    };

    // Update user profile if necessary
    if (!userProfileDoc.exists) {
      batch.set(userProfileRef, userProfileData); // Only set if profile doesn't exist
    }

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
