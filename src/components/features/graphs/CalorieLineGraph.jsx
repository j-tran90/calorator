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
import { saveData, getData } from "../../../utils/indexedDB";

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
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUid(currentUser.uid);
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, []);

  // Fetch createdDate (goal start)
  useEffect(() => {
    if (!uid) return;
    const fetchUserGoal = async () => {
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
        setError("Failed to fetch user goal data.");
        setLoading(false);
      }
    };
    fetchUserGoal();
  }, [uid]);

  // Main graph data logic with IndexedDB caching
  useEffect(() => {
    if (!createdDate || !uid) return;

    const fetchData = async () => {
      setLoading(true);

      // 1. Get cached data from IndexedDB
      const cachedDataObj = await getData(`calorieLineData-${uid}`);
      const cachedData = cachedDataObj?.data || {};
      console.log(
        `[${new Date().toISOString()}] Cached data from IndexedDB:`,
        cachedData
      );

      // 2. Determine lastKnownDate
      const lastKnownDate = cachedData.lastKnownDate
        ? Timestamp.fromDate(new Date(cachedData.lastKnownDate))
        : Timestamp.fromDate(new Date(createdDate));
      console.log(
        `[${new Date().toISOString()}] Retrieved lastKnownDate:`,
        lastKnownDate.toDate()
      );

      // 3. Get latestCreatedAt from Firestore
      const latestEntryDoc = await getDoc(doc(db, "latestEntries", uid));
      if (!latestEntryDoc.exists()) {
        setTotalCaloriesByDay(cachedData.totalCaloriesByDay || {});
        setLoading(false);
        return;
      }
      const latestEntryData = latestEntryDoc.data();
      console.log(
        `[${new Date().toISOString()}] Latest entry document data:`,
        latestEntryData
      );
      if (!latestEntryData?.latestCreatedAt) {
        setTotalCaloriesByDay(cachedData.totalCaloriesByDay || {});
        setLoading(false);
        return;
      }
      const latestCreatedAt = latestEntryData.latestCreatedAt.toDate();
      console.log(
        `[${new Date().toISOString()}] Latest createdAt from Firestore:`,
        latestCreatedAt
      );

      // Normalize both dates to milliseconds for comparison
      const lastKnownDateMillis = lastKnownDate.toMillis();
      const latestCreatedAtMillis =
        Timestamp.fromDate(latestCreatedAt).toMillis();
      console.log(
        `[${new Date().toISOString()}] Normalized lastKnownDate (ms):`,
        lastKnownDateMillis
      );
      console.log(
        `[${new Date().toISOString()}] Normalized latestCreatedAt (ms):`,
        latestCreatedAtMillis
      );

      // 4. If no new data, use cached
      if (latestCreatedAtMillis <= lastKnownDateMillis) {
        console.log(`[${new Date().toISOString()}] No new entries to fetch.`);
        setTotalCaloriesByDay(cachedData.totalCaloriesByDay || {});
        setCalorieTarget(cachedData.calorieTarget || 2000);
        setLoading(false);
        return;
      }

      // 5. Fetch new entries, merge, and save
      const createdAtQuery = query(
        collection(db, "journal/" + uid + "/entries"),
        where("createdAt", ">", lastKnownDate)
      );
      console.log(
        `[${new Date().toISOString()}] Executing Firestore query with lastKnownDate:`,
        lastKnownDate.toDate()
      );
      const createdAtSnapshot = await getDocs(createdAtQuery);
      console.log(
        `[${new Date().toISOString()}] Number of entries fetched by createdAt:`,
        createdAtSnapshot.docs.length
      );

      if (createdAtSnapshot.empty) {
        setLoading(false);
        return;
      }

      // Map the fetched entries
      const newEntries = createdAtSnapshot.docs.map((doc) => doc.data());
      console.log(
        `[${new Date().toISOString()}] Fetched entries from Firestore:`,
        newEntries
      );

      // Merge new data with cached data
      const caloriesByDay = { ...cachedData.totalCaloriesByDay };
      newEntries.forEach((entry) => {
        const entryDate = dayjs(entry.createdAt.toDate()).format("MMM DD");
        if (!caloriesByDay[entryDate]) {
          caloriesByDay[entryDate] = 0;
        }
        caloriesByDay[entryDate] += entry.calories || 0;
      });
      console.log(
        `[${new Date().toISOString()}] Calories data after merging:`,
        caloriesByDay
      );

      setTotalCaloriesByDay(caloriesByDay);

      // Fetch the calorie target from Firestore
      const userProfileDocRef = doc(db, "users", uid);
      const userProfileDoc = await getDoc(userProfileDocRef);
      const target = userProfileDoc.data()?.calorieTarget || 2000;
      setCalorieTarget(target);

      // Find most recent date
      const mostRecentDate = newEntries.reduce((latest, entry) => {
        const entryDate = entry.createdAt.toDate();
        return entryDate > latest ? entryDate : latest;
      }, lastKnownDate.toDate());
      console.log(
        `[${new Date().toISOString()}] Calculated mostRecentDate:`,
        mostRecentDate
      );

      // Save to IndexedDB
      await saveData(`calorieLineData-${uid}`, {
        totalCaloriesByDay: caloriesByDay,
        calorieTarget: target,
        lastKnownDate: mostRecentDate.toISOString(),
      });
      // console.log(
      //   `[${new Date().toISOString()}] Updated lastKnownDate saved to IndexedDB:`,
      //   mostRecentDate
      // );
      // console.log(
      //   "Saved lastKnownDate to IndexedDB:",
      //   mostRecentDate.toISOString()
      // );

      // Retrieve lastKnownDate from IndexedDB to confirm it was updated
      // const updatedCachedData = await getData(`calorieLineData-${uid}`);
      // console.log(
      //   `[${new Date().toISOString()}] Retrieved updated lastKnownDate from IndexedDB:`,
      //   updatedCachedData?.lastKnownDate
      // );

      setLoading(false);
    };

    fetchData();
  }, [createdDate, uid]);

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
