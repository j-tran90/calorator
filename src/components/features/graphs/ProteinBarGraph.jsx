import React, { useEffect, useState } from "react";
import { db, auth } from "../../../config/Firebase"; // Ensure auth is imported
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
import { saveData, getData } from "../../../utils/indexedDB"; // Import IndexedDB utilities
import useGoals from "../../../hooks/useGoals";

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
  const {
    createdDate, // Retrieve createdDate from useGoals
    proteinTarget,
  } = useGoals();

  const [uid, setUid] = useState(null); // State to store the user's UID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProteinByDay, setTotalProteinByDay] = useState({});

  useEffect(() => {
    // Retrieve the UID from Firebase Auth
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log("User authenticated. UID:", currentUser.uid);
      setUid(currentUser.uid);
    } else {
      console.error("No user is authenticated.");
      setError("User not authenticated.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserGoal = async () => {
      if (!uid || !createdDate) {
        console.warn("UID or createdDate is missing. Skipping fetch.");
        setLoading(false);
        return;
      }

      try {
        console.log(
          `[${new Date().toISOString()}] Fetching data for UID:`,
          uid
        );

        // Retrieve the last known date and cached data from IndexedDB
        const cachedData = await getData(`proteinData-${uid}`);
        console.log(
          `[${new Date().toISOString()}] Cached data from IndexedDB:`,
          cachedData
        );

        // Ensure lastKnownDate is properly initialized
        const lastKnownDate = cachedData?.lastKnownDate
          ? Timestamp.fromDate(new Date(cachedData.lastKnownDate))
          : Timestamp.fromDate(new Date(createdDate)); // Fallback to createdDate
        console.log(
          `[${new Date().toISOString()}] Retrieved lastKnownDate:`,
          lastKnownDate.toDate()
        );

        // Fetch the latestCreatedAt from the latestEntries collection
        const latestEntryDoc = await getDoc(doc(db, "latestEntries", uid));
        if (!latestEntryDoc.exists()) {
          console.log(
            `[${new Date().toISOString()}] No latest entry found for UID:`,
            uid
          );
          setLoading(false);
          return;
        }

        const latestEntryData = latestEntryDoc.data();
        console.log(
          `[${new Date().toISOString()}] Latest entry document data:`,
          latestEntryData
        );

        // Ensure latestCreatedAt exists
        if (!latestEntryData?.latestCreatedAt) {
          console.error(
            `[${new Date().toISOString()}] latestCreatedAt is missing in latestEntries document.`
          );
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

        // Compare latestCreatedAt with lastKnownDate
        if (latestCreatedAtMillis <= lastKnownDateMillis) {
          console.log(`[${new Date().toISOString()}] No new entries to fetch.`);
          setLoading(false);
          return;
        }

        // Query Firestore for entries with createdAt >= lastKnownDate
        const createdAtQuery = query(
          collection(db, `journal/${uid}/entries`),
          where("createdAt", ">=", lastKnownDate)
        );

        console.log(
          `[${new Date().toISOString()}] Executing Firestore query with lastKnownDate:`,
          lastKnownDate.toDate()
        );

        // Fetch the query
        const createdAtSnapshot = await getDocs(createdAtQuery);
        console.log(
          `[${new Date().toISOString()}] Number of entries fetched by createdAt:`,
          createdAtSnapshot.docs.length
        );

        if (createdAtSnapshot.empty) {
          console.log(
            `[${new Date().toISOString()}] No entries found in Firestore.`
          );
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
        const proteinByDay = { ...cachedData?.totalProteinByDay }; // Start with cached data
        console.log(
          `[${new Date().toISOString()}] Protein data before merging:`,
          proteinByDay
        );

        // Add protein data from new entries
        newEntries.forEach((entry) => {
          const entryDate = dayjs(entry.createdAt.toDate()).format("MMM DD");
          if (!proteinByDay[entryDate]) {
            proteinByDay[entryDate] = 0;
          }
          proteinByDay[entryDate] += entry.protein || 0;
        });

        console.log(
          `[${new Date().toISOString()}] Protein data after merging:`,
          proteinByDay
        );

        setTotalProteinByDay(proteinByDay);

        // Calculate the most recent date from the fetched entries
        const mostRecentDate = newEntries.reduce((latest, entry) => {
          const entryDate = entry.createdAt.toDate();
          return entryDate > latest ? entryDate : latest;
        }, lastKnownDate.toDate());

        console.log(
          `[${new Date().toISOString()}] Calculated mostRecentDate:`,
          mostRecentDate
        );

        // Save updated data and the new lastKnownDate to IndexedDB
        await saveData(`proteinData-${uid}`, {
          totalProteinByDay: proteinByDay,
          lastKnownDate: mostRecentDate, // Save the most recent date
        });

        console.log(
          `[${new Date().toISOString()}] Updated lastKnownDate saved to IndexedDB:`,
          mostRecentDate
        );

        // Retrieve lastKnownDate from IndexedDB to confirm it was updated
        const updatedCachedData = await getData(`proteinData-${uid}`);
        console.log(
          `[${new Date().toISOString()}] Retrieved updated lastKnownDate from IndexedDB:`,
          updatedCachedData?.lastKnownDate
        );
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] Error fetching protein entries:`,
          error
        );
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (uid && createdDate) {
      fetchUserGoal();
    }
  }, [uid, createdDate]); // Add createdDate as a dependency

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const dates = Object.keys(totalProteinByDay);
  const proteins = Object.values(totalProteinByDay);
  const targetLine = new Array(dates.length).fill(proteinTarget);

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Protein",
        data: proteins,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
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
