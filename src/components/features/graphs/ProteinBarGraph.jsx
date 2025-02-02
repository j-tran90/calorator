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
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Test = () => {
  const [totalProteinByDay, setTotalProteinByDay] = useState({});
  const [proteinTarget, setProteinTarget] = useState(0);
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
        // Fetch user goal data where status is 'in progress'
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

        // Assuming only one goal document should be in 'in progress' state
        const goalDoc = querySnapshot.docs[0].data();
        const startDate = goalDoc.createdDate; // Assuming createdDate is stored in the goal document

        if (!startDate) {
          setError("Created date not found in user goal data.");
          setLoading(false);
          return;
        }

        // Fetch the protein data
        await fetchProteinData(startDate);
      } catch (error) {
        console.error("Error fetching user goal:", error);
        setError("Failed to fetch user goal data.");
        setLoading(false);
      }
    };

    fetchUserGoal();
  }, [uid]);

  const fetchProteinData = async (startDate) => {
    if (!uid) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      // Get the start date (from createdDate) and end date (today)
      const startOfPeriod = new Date(startDate); // Use createdDate here
      const endOfPeriod = new Date(); // Today

      // Convert to Firestore Timestamp objects
      const startOfPeriodTimestamp = Timestamp.fromDate(startOfPeriod);
      const endOfPeriodTimestamp = Timestamp.fromDate(endOfPeriod);

      // Query the "entries" collection for the date range from createdDate to today
      const proteinQuery = query(
        collection(db, "journal/" + uid + "/entries"),
        where("createdAt", ">=", startOfPeriodTimestamp),
        where("createdAt", "<=", endOfPeriodTimestamp)
      );

      // Fetch the data from Firestore
      const querySnapshot = await getDocs(proteinQuery);

      if (querySnapshot.empty) {
        setError();
        setLoading(false);
        return;
      }

      // Extract the data from the querySnapshot
      const entries = querySnapshot.docs.map((doc) => doc.data());

      // Sum the protein for each day in the date range
      const proteinByDay = {};
      entries.forEach((entry) => {
        const entryDate = dayjs(entry.createdAt.toDate()).format("MMM DD");
        if (!proteinByDay[entryDate]) {
          proteinByDay[entryDate] = 0;
        }
        proteinByDay[entryDate] += entry.protein || 0;
      });

      setTotalProteinByDay(proteinByDay);

      // Fetch the protein target from Firestore (assuming it's stored in the user's profile or goals)
      const userProfileDocRef = doc(db, "userGoals", uid);
      const userProfileDoc = await getDoc(userProfileDocRef);
      const target = userProfileDoc.data()?.dailyProteinTarget || null;
      setProteinTarget(target);
    } catch (error) {
      console.error("Error fetching protein entries:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Prepare data for Chart.js
  const dates = Object.keys(totalProteinByDay);
  const proteins = Object.values(totalProteinByDay);
  const targetLine = new Array(dates.length).fill(proteinTarget);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Protein",
        data: proteins,
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Light blue bars
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        stack: "stack1",
      },
      {
        label: "Protein Target",
        data: targetLine,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        borderWidth: 2,
        borderDash: [5, 5],
        stack: "stack1",
      },
    ],
  };

  return (
    <div>
      <h3>Total Protein from Start Date to Today</h3>
      {Object.keys(totalProteinByDay).length === 0 ? (
        <p>No data found for this period.</p>
      ) : (
        <Bar
          data={data}
          options={{
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Protein (g)",
                },
                stacked: true,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default Test;
