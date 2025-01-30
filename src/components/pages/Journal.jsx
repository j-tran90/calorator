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
import { db, auth } from "../../config/Firebase";
import ClearIcon from "@mui/icons-material/Clear";
import useTracker from "../../hooks/useTracker";
import {
  Grid2,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function Journal() {
  const { calorieTarget, calorieTotal } = useTracker(0);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

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
    <Box sx={{ padding: 2 }}>
      <Typography variant='h5' textAlign='center' mb={2}>
        Journal
      </Typography>
      <Grid2 container spacing={2} justifyContent='center' alignItems='center'>
        <Grid2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Start Date'
              value={startDate}
              onChange={(date) => handleStartDateChange(date)}
              sx={{ width: { xs: "163.5px", md: "259px" } }}
            />
          </LocalizationProvider>
        </Grid2>
        <Grid2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='End Date'
              value={endDate}
              onChange={(date) => handleEndDateChange(date)}
              sx={{ width: { xs: "163.5px", md: "259px" } }}
            />
          </LocalizationProvider>
        </Grid2>
        <Grid2 textAlign='center'>
          <Button
            variant='contained'
            color='primary'
            onClick={handleTodayButtonClick}
            fullWidth
            style={{ color: "#fff", backgroundColor: "#000" }}
          >
            Reset Filter
          </Button>
        </Grid2>
      </Grid2>
      <Paper sx={{ marginTop: 3, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#9999" }}>
              <TableCell>Entry</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Food</TableCell>
              <TableCell>Calories</TableCell>
              <TableCell>Protein</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry, index) => {
              const createdAt = entry.createdAt
                ? entry.createdAt.toDate()
                : null;
              if (!createdAt) return null;

              const previousEntry =
                index > 0 ? data[index - 1].createdAt.toDate() : null;
              const isNewDay =
                !previousEntry ||
                createdAt.getDate() !== previousEntry.getDate();

              return (
                <React.Fragment key={entry.id}>
                  {isNewDay && (
                    <TableRow sx={{ backgroundColor: "#9992" }}>
                      <TableCell
                        colSpan={6}
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        {createdAt.toLocaleDateString(navigator.language, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell>{index + 1}.</TableCell>
                    <TableCell>
                      {createdAt
                        .toLocaleTimeString(navigator.language, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        .replace(/^0+/, "")}
                    </TableCell>
                    <TableCell>
                      {typeof entry.food === "string"
                        ? entry.food.replace(/(^\w{1})|(\s+\w{1})/g, (value) =>
                            value.toUpperCase()
                          )
                        : entry.food
                        ? String(entry.food) // If `entry.food` is not null/undefined, convert it to a string
                        : "N/A"}
                    </TableCell>

                    <TableCell>{entry.calories}</TableCell>
                    <TableCell>{entry.protein} g</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClick={() => handleEntryDelete(entry.id)}
                        sx={{
                          backgroundColor: "red",
                          "&:hover": { backgroundColor: "#900" },
                        }}
                      >
                        <ClearIcon
                          style={{
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
