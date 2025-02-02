import React, { useEffect, useState } from "react";
import { db, auth } from "../../../config/Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import dayjs from "dayjs";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const CalorieLineGraph = () => {
  const [createdDate, setCreatedDate] = useState(null);
  const [totalCaloriesByDay, setTotalCaloriesByDay] = useState({});
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { uid } = auth.currentUser;

  useEffect(() => {
    const fetchUserGoal = async () => {
      if (!uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const userGoalQuery = query(
          collection(db, "userGoals", uid, "goalsHistory"),
          where("status", "==", "in progress")
        );

        const querySnapshot = await getDocs(userGoalQuery);

        if (querySnapshot.empty) {
          setError("No user goal found with status 'in progress'");
          setLoading(false);
          return;
        }

        const goalDoc = querySnapshot.docs[0].data();
        const startDate = goalDoc.createdDate;

        if (!startDate) {
          setError("Created date not found in user goal data.");
          setLoading(false);
          return;
        }

        setCreatedDate(startDate);
      } catch (error) {
        console.error("Error fetching user goal:", error);
        setError("Failed to fetch user goal data.");
        setLoading(false);
      }
    };

    fetchUserGoal();
  }, [uid]);

  useEffect(() => {
    if (!createdDate) {
      return;
    }

    const fetchCalorieData = async () => {
      if (!uid) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        // Get the start date (from createdDate) and end date (today)
        const startOfPeriod = new Date(createdDate);
        const endOfPeriod = new Date(); // Today

        // Convert to Firestore Timestamp objects
        const startOfPeriodTimestamp = Timestamp.fromDate(startOfPeriod);
        const endOfPeriodTimestamp = Timestamp.fromDate(endOfPeriod);

        // Query the "entries" collection for the date range from createdDate to today
        const calorieQuery = query(
          collection(db, "journal/" + uid + "/entries"),
          where("createdAt", ">=", startOfPeriodTimestamp),
          where("createdAt", "<=", endOfPeriodTimestamp)
        );

        // Fetch the data from Firestore
        const querySnapshot = await getDocs(calorieQuery);

        if (querySnapshot.empty) {
          setError();
          setLoading(false);
          return;
        }

        // Extract the data from the querySnapshot
        const entries = querySnapshot.docs.map((doc) => doc.data());

        // Sum the calories for each day in the date range
        const caloriesByDay = {};
        entries.forEach((entry) => {
          const entryDate = dayjs(entry.createdAt.toDate()).format("MMM DD");
          if (!caloriesByDay[entryDate]) {
            caloriesByDay[entryDate] = 0;
          }
          caloriesByDay[entryDate] += entry.calories || 0;
        });

        setTotalCaloriesByDay(caloriesByDay);

        // Fetch the calorie target from Firestore (assuming it's stored in the user's profile or goals)
        const userProfileDocRef = doc(db, "users", uid);
        const userProfileDoc = await getDoc(userProfileDocRef);
        const target = userProfileDoc.data()?.calorieTarget || 2000;
        setCalorieTarget(target);
      } catch (error) {
        console.error("Error fetching calorie entries:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalorieData();
  }, [uid, createdDate]); // Added createdDate as a dependency

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Prepare data for Chart.js
  const dates = Object.keys(totalCaloriesByDay);
  const calories = Object.values(totalCaloriesByDay);
  const targetLine = new Array(dates.length).fill(calorieTarget);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Calories",
        data: calories,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Calorie Target",
        data: targetLine,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  return (
    <div>
      <h3>
        Total Calories from {dayjs(createdDate).format("MMM DD, YYYY")} to Today
      </h3>
      {Object.keys(totalCaloriesByDay).length === 0 ? (
        <p>No data found for this period.</p>
      ) : (
        <Line
          data={data}
          options={{
            responsive: true,
            scales: {
              x: { title: { display: true, text: "Date" } },
              y: { title: { display: true, text: "Calories" } },
            },
          }}
        />
      )}
    </div>
  );
};

export default CalorieLineGraph;
