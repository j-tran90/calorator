import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import dayjs from "dayjs";
import app from "../config/Firebase"; // Ensure app is imported if needed

const db = getFirestore(app);
const auth = getAuth(app);

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
    const batch = writeBatch(db);

    // Check if user profile already exists
    const userProfileRef = doc(db, "userProfile", uid);
    const userProfileDoc = await getDoc(userProfileRef);

    // If the profile exists, do not overwrite existing fields
    const userProfileData = {
      dob: calorieData.dob || userProfileDoc.data()?.dob || "",
      height:
        parseFloat(calorieData.height) || userProfileDoc.data()?.height || 0,
      gender: calorieData.gender || userProfileDoc.data()?.gender || "",
      joinDate: userProfileDoc.exists()
        ? userProfileDoc.data()?.joinDate
        : currentDate, // Only set joinDate if the profile doesn't exist
    };

    // Update user profile if necessary
    if (!userProfileDoc.exists()) {
      batch.set(userProfileRef, userProfileData); // Only set if profile doesn't exist
    }

    // Update user goals and goal history
    const userGoalsRef = doc(db, "userGoals", uid);
    batch.set(userGoalsRef, userGoalData);

    const goalsHistoryRef = collection(db, "userGoals", uid, "goalsHistory");
    const snapshot = await getDocs(goalsHistoryRef);
    snapshot.forEach((docSnapshot) => {
      const docRef = doc(goalsHistoryRef, docSnapshot.id);
      batch.update(docRef, { status: "completed" });
    });

    // Add new goal to goals history
    const newGoalRef = doc(goalsHistoryRef);
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
