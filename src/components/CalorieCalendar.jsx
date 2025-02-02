import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { db, auth } from "../config/Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";

const CalorieCalendar = () => {
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startOfPeriod, setStartOfPeriod] = useState(null);
  const [endOfPeriod, setEndOfPeriod] = useState(dayjs().format("YYYY-MM-DD"));
  const { uid } = auth.currentUser || {};

  useEffect(() => {
    if (!uid) return;

    const fetchCalorieData = async () => {
      try {
        const userProfileDocRef = doc(db, "users", uid);
        const userProfileDoc = await getDoc(userProfileDocRef);
        const target = userProfileDoc.data()?.calorieTarget || 2000;
        setCalorieTarget(target);

        const userGoalQuery = query(
          collection(db, "userGoals", uid, "goalsHistory"),
          where("status", "==", "in progress")
        );

        const querySnapshot = await getDocs(userGoalQuery);
        if (querySnapshot.empty) return;

        const goalDoc = querySnapshot.docs[0].data();
        const startDate = goalDoc.createdDate;
        if (!startDate) return;

        let start;
        if (startDate instanceof Timestamp) {
          start = dayjs(startDate.toDate()).format("YYYY-MM-DD");
        } else if (startDate instanceof Date) {
          start = dayjs(startDate).format("YYYY-MM-DD");
        } else {
          // If it's a string, assume it's already formatted correctly
          start = startDate;
        }

        setStartOfPeriod(start);

        const calorieQuery = query(
          collection(db, `journal/${uid}/entries`),
          where("createdAt", ">=", Timestamp.fromDate(new Date(start))),
          where("createdAt", "<=", Timestamp.fromDate(new Date()))
        );

        const querySnapshotEntries = await getDocs(calorieQuery);
        const entries = querySnapshotEntries.docs.map((doc) => doc.data());

        const daysMetTarget = new Set();
        entries.forEach((entry) => {
          const entryDate = dayjs(entry.createdAt.toDate()).format(
            "YYYY-MM-DD"
          );
          if (!daysMetTarget.has(entryDate)) {
            daysMetTarget.add(entryDate);
          }
        });

        setHighlightedDays([...daysMetTarget]);
      } catch (error) {
        console.error("Error fetching calorie data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalorieData();
  }, [uid]);

  function CustomDay(props) {
    const { day, outsideCurrentMonth, ...other } = props;
    const formattedDay = day.format("YYYY-MM-DD");
    const isHighlighted = highlightedDays.includes(formattedDay);
    const isWithinGoalPeriod =
      startOfPeriod &&
      day.isAfter(dayjs(startOfPeriod).subtract(1, "day")) &&
      day.isBefore(dayjs(endOfPeriod).add(1, "day"));

    return (
      <Badge
        key={day.toString()}
        overlap='circular'
        badgeContent={
          isHighlighted ? "✅" : isWithinGoalPeriod ? "❌" : undefined
        }
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        loading={loading}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{ day: CustomDay }}
      />
    </LocalizationProvider>
  );
};

export default CalorieCalendar;
