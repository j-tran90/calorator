import Navigation from "../components/NavBar";
import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../config/Firebase";
import { RiDeleteBack2Fill } from "react-icons/ri";
import useTracker from "../hooks/useTracker";
import User from "../components/User";

export default function Journal() {
  const { calorieTarget, total } = useTracker(0);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const { uid } = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      const startOfStartDate = startDate.startOf("day").toDate();
      const endOfEndDate = endDate.endOf("day").toDate();

      const entryCollectionRef = query(
        collection(db, `journal/${uid}/entries`),
        orderBy("createdAt", "asc"),
        where("createdAt", ">=", startOfStartDate),
        where("createdAt", "<=", endOfEndDate)
      );

      try {
        const querySnapshot = await getDocs(entryCollectionRef);
        const entries = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(entries);
      } catch (error) {
        console.error("Error fetching entries: ", error);
      }
    };

    fetchData();
  }, [startDate, endDate, uid]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleTodayButtonClick = () => {
    setStartDate(dayjs());
    setEndDate(dayjs());
  };

  const handleEntryDelete = async (id) => {
    try {
      await deleteDoc(doc(db, `journal/${uid}/entries`, id));
      setData(data.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry: ", error);
    }
  };

  return (
    <>
      <User />
      <h3>
        <button onClick={handleTodayButtonClick}>
          Today: {total}/{calorieTarget}
        </button>
      </h3>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label='Start Date'
          value={startDate}
          onChange={(date) => handleStartDateChange(date)}
        />
        <DatePicker
          label='End Date'
          value={endDate}
          onChange={(date) => handleEndDateChange(date)}
        />
      </LocalizationProvider>
      <table>
        <tbody>
          <tr id='table-head'>
            <td>Entry</td>
            <td>Time</td>
            <td>Food</td>
            <td>Calories</td>
          </tr>
          {data.map((entry, index) => {
            const currentDate = entry.createdAt.toDate();
            const previousEntry =
              index > 0 ? data[index - 1].createdAt.toDate() : null;
            const isNewDay =
              !previousEntry ||
              currentDate.getDate() !== previousEntry.getDate();

            return (
              <React.Fragment key={entry.id}>
                {isNewDay && (
                  <tr>
                    <td
                      colSpan='4'
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {currentDate.toLocaleDateString(navigator.language, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                )}
                <tr key={entry.id}>
                  <td>{index + 1}.</td>
                  <td>
                    {currentDate
                      .toLocaleTimeString(navigator.language, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .replace(/^0+/, "")}
                  </td>
                  <td>
                    {entry.food.replace(/(^\w{1})|(\s+\w{1})/g, (value) =>
                      value.toUpperCase()
                    )}
                  </td>
                  <td>{entry.calories}</td>
                  <td>
                    <RiDeleteBack2Fill
                      style={{
                        marginLeft: "20px",
                        marginBottom: "-3px",
                        color: "red",
                      }}
                      onClick={() => {
                        handleEntryDelete(entry.id);
                      }}
                    />
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
