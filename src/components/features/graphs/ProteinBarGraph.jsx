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

const ProteinBarGraph = () => {
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

      const storedData = JSON.parse(localStorage.getItem(`proteinData-${uid}`));
      const currentDate = dayjs().format("YYYY-MM-DD"); // Declare here

      if (storedData && storedData.date === currentDate) {
        setTotalProteinByDay(storedData.totalProteinByDay);
        setProteinTarget(storedData.proteinTarget);
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

        await fetchProteinData(startDate, currentDate); // Pass currentDate
      } catch (error) {
        console.error("Error fetching user goal:", error);
        setError("Failed to fetch user goal data.");
        setLoading(false);
      }
    };

    fetchUserGoal();
  }, [uid]);

  const fetchProteinData = async (startDate, currentDate) => {
    // Accept currentDate
    if (!uid) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const startOfPeriod = new Date(startDate);
      const endOfPeriod = new Date();

      const startOfPeriodTimestamp = Timestamp.fromDate(startOfPeriod);
      const endOfPeriodTimestamp = Timestamp.fromDate(endOfPeriod);

      const proteinQuery = query(
        collection(db, "journal/" + uid + "/entries"),
        where("createdAt", ">=", startOfPeriodTimestamp),
        where("createdAt", "<=", endOfPeriodTimestamp)
      );

      const querySnapshot = await getDocs(proteinQuery);

      if (querySnapshot.empty) {
        setError("No entries found for this period.");
        setLoading(false);
        return;
      }

      const entries = querySnapshot.docs.map((doc) => doc.data());

      const proteinByDay = {};
      entries.forEach((entry) => {
        const entryDate = dayjs(entry.createdAt.toDate()).format("MMM DD");
        if (!proteinByDay[entryDate]) {
          proteinByDay[entryDate] = 0;
        }
        proteinByDay[entryDate] += entry.protein || 0;
      });

      setTotalProteinByDay(proteinByDay);

      const userProfileDocRef = doc(db, "userGoals", uid);
      const userProfileDoc = await getDoc(userProfileDocRef);
      const target = userProfileDoc.data()?.dailyProteinTarget || null;
      setProteinTarget(target);

      localStorage.setItem(
        `proteinData-${uid}`,
        JSON.stringify({
          date: currentDate, // Now properly passed
          totalProteinByDay: proteinByDay,
          proteinTarget: target,
        })
      );
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

  const dates = Object.keys(totalProteinByDay);
  const proteins = Object.values(totalProteinByDay);
  const targetLine = new Array(dates.length).fill(proteinTarget);

  // Gradient for the protein bars
  const gradientColor = "linear-gradient(90deg, #FFD700, #4FC483)";

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Protein",
        data: proteins,
        backgroundColor: gradientColor,
        borderColor: "#4FC483",
        borderWidth: 1,
        barThickness: 10,
        fill: true,
      },
      {
        label: "Protein Target",
        data: targetLine,
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        borderDash: [5, 5],
        type: "line",
        pointRadius: 0,
        fill: false,
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
                beginAtZero: true,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default ProteinBarGraph;
