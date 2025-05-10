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
import MoreVertIcon from "@mui/icons-material/MoreVert"; // 3 vertical dots icon
import {
  Grid2,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Header from "../navigation/Header";
import { Restore } from "@mui/icons-material";

export default function Journal() {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // ID for the entry to delete
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      const startOfStartDate = startDate.startOf("day").toDate();
      const endOfEndDate = endDate.endOf("day").toDate();

      const entryCollectionRef = query(
        collection(db, `journal/${uid}/entries`),
        orderBy("createdAt", "desc"),
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

  const handleEntryDelete = async () => {
    try {
      if (!deleteId) {
        console.warn("No entry selected for deletion.");
        return;
      }

      console.log(
        `[${new Date().toISOString()}] Deleting entry with ID:`,
        deleteId
      );

      // Delete the entry from Firestore
      await deleteDoc(doc(db, `journal/${uid}/entries`, deleteId));

      // Update the state to remove the deleted entry
      setData((prevData) => prevData.filter((entry) => entry.id !== deleteId));

      console.log(`[${new Date().toISOString()}] Entry deleted successfully.`);

      // Clear the delete ID and close the menu
      handleMenuClose(); // Ensure the menu is closed after deletion
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget); // Set the anchor element to the button that triggered the menu
    setDeleteId(id); // Store the ID of the entry to delete
  };

  const handleMenuClose = () => {
    if (anchorEl) {
      anchorEl.focus(); // Return focus to the button that triggered the menu
    }
    setAnchorEl(null); // Reset the anchor element
    setDeleteId(null); // Clear the delete ID
  };

  return (
    <>
      <Grid2
        container
        alignItems='center'
        justifyContent='space-between'
        sx={{ m: 2, height: "50px" }}
      >
        <Grid2 size={{ xxs: 6 }}>
          <Header headText='Journal' />
        </Grid2>

        <Grid2
          size={{ xxs: 6 }}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant='link'
            onClick={handleTodayButtonClick}
            sx={{ borderColor: "#000", padding: 0 }}
          >
            <Restore sx={{fontSize: 40}}/>
          </Button>
        </Grid2>
      </Grid2>

      <Box sx={{ p: { xxs: 1, md: 2 } }}>
        <Grid2
          container
          spacing={2}
          justifyContent='center'
          alignItems='center'
        >
          <Grid2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Start Date'
                value={startDate}
                onChange={(date) => handleStartDateChange(date)}
                sx={{ width: { xxs: "163.5px", md: "259px" } }}
              />
            </LocalizationProvider>
          </Grid2>
          <Grid2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='End Date'
                value={endDate}
                onChange={(date) => handleEndDateChange(date)}
                sx={{ width: { xxs: "163.5px", md: "259px" } }}
              />
            </LocalizationProvider>
          </Grid2>
        </Grid2>
        <Paper sx={{ marginTop: 3, overflowX: "auto", borderRadius: "20px" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#9999" }}>
                <TableCell></TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Food</TableCell>
                <TableCell>Calories</TableCell>
                <TableCell>Protein</TableCell>
                <TableCell sx={{ display: { xxs: "none", md: "table-cell" } }}>
                  Sugar
                </TableCell>
                <TableCell sx={{ display: { xxs: "none", md: "table-cell" } }}>
                  Carbs
                </TableCell>
                <TableCell sx={{ display: { xxs: "none", md: "table-cell" } }}>
                  Fats
                </TableCell>
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
                          colSpan={9}
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
                      <TableCell>{index + 1}</TableCell>
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
                          ? entry.food.replace(
                              /(^\w{1})|(\s+\w{1})/g,
                              (value) => value.toUpperCase()
                            )
                          : entry.food
                          ? String(entry.food) // If `entry.food` is not null/undefined, convert it to a string
                          : "N/A"}
                      </TableCell>

                      <TableCell>{entry.calories}</TableCell>
                      <TableCell>{entry.protein} g</TableCell>
                      <TableCell
                        sx={{ display: { xxs: "none", md: "table-cell" } }}
                      >
                        {entry.sugar}
                      </TableCell>
                      <TableCell
                        sx={{ display: { xxs: "none", md: "table-cell" } }}
                      >
                        {entry.carbs}
                      </TableCell>
                      <TableCell
                        sx={{ display: { xxs: "none", md: "table-cell" } }}
                      >
                        {entry.fats}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleMenuOpen(event, entry.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)} // Only open the menu if anchorEl is valid
                          onClose={handleMenuClose} // Close the menu and reset focus
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              handleEntryDelete();
                              handleMenuClose(); // Ensure the menu is closed after deletion
                            }}
                            sx={{ color: "red" }}
                          >
                            Delete Entry
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </>
  );
}
