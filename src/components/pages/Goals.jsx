import { db, auth } from "../../config/Firebase";

import {
  Typography,
  Box,
  TablePagination,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Grid2,
  Divider,
  Stack,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import SetTargetButton from "../buttons/SetTargetButton";
import dayjs from "dayjs";
import {
  AccessAlarm,
  Add,
  ArrowDownward,
  ArrowUpward,
  CheckCircle,
  Forward,
  HourglassTop,
  Remove,
  Scale,
} from "@mui/icons-material";

import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import useGoals from "../../hooks/useGoals";
import Header from "../navigation/Header";

export default function Goals() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const uid = auth.currentUser?.uid;
  const [goalHistory, setGoalHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { targetDate, createdDate, remainingDays } = useGoals(0);

  const boxStyles = {
    textAlign: "left",
    p: 2,
    overflow: "hidden",
  };

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const startOfDay = dayjs().startOf("day").toDate();
      const endOfDay = dayjs().endOf("day").toDate();

      const entryQuery = query(
        collection(db, `journal/${uid}/entries`),
        where("createdAt", ">=", startOfDay),
        where("createdAt", "<=", endOfDay),
        orderBy("createdAt", "asc")
      );

      try {
        const querySnapshot = await getDocs(entryQuery);
        const fetchedEntries = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(fetchedEntries);
      } catch (error) {
        setError("Error fetching journal entries. Please try again.");
        console.error("Error fetching journal entries: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  useEffect(() => {
    const fetchGoalHistory = async () => {
      if (!uid) {
        console.error("No user is authenticated.");
        return;
      }

      const goalHistoryRef = collection(db, "userGoals", uid, "goalsHistory");
      const q = query(goalHistoryRef);

      try {
        const querySnapshot = await getDocs(q);

        const goalData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by status: 'in progress' first, then 'complete'
        goalData.sort((a, b) => {
          if (a.status === "in progress" && b.status !== "in progress") {
            return -1;
          }
          if (a.status !== "in progress" && b.status === "in progress") {
            return 1;
          }
          return 0; // No change if both have the same status
        });

        setGoalHistory(goalData);
      } catch (error) {
        console.error("Error fetching goal history:", error);
      }
    };

    fetchGoalHistory();
  }, [uid]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  const formatDate = (date) => {
    return dayjs(date).format("MMM DD, YYYY");
  };

  // Paginate the goalHistory based on current page and rowsPerPage
  const paginatedData = goalHistory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ pb: 2 }}>
        <Grid2 container>
          <Grid2 size={{ xs: 6 }} sx={{ pl: 2 }}>
            <Header headText='Your Plans' />
          </Grid2>
          <Grid2
            size={{ xs: 6 }}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              pr: 2,
            }}
          >
            <SetTargetButton />
          </Grid2>
        </Grid2>
      </Box>

      {loading ? (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight='50vh'
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Stack
            component={Paper}
            sx={{ borderRadius: "20px", m: 1, p: { xs: 1, md: 2 } }}
            divider={<Divider sx={{ bgcolor: "#d3d3d3", height: "1px" }} />}
            spacing={0}
          >
            {paginatedData.map((goal) => (
              <Box sx={boxStyles} key={goal.id}>
                <Grid2 container>
                  <Grid2 size={{ xs: 9 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: "bold" }}>
                      {formatDate(goal.createdDate)} to{" "}
                      {formatDate(goal.targetDate)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 3 }} textAlign='right'>
                    <Typography variant='caption' sx={{ fontStyle: "italic" }}>
                      {goal.status.charAt(0).toUpperCase() +
                        goal.status.slice(1)}
                    </Typography>
                  </Grid2>
                </Grid2>
                <Grid2 container alignItems='center'>
                  <Grid2 size={{ xs: 9 }}>
                    <Stack>
                      <Typography variant='caption'>
                        {goal.weightTarget > goal.currentWeight ? (
                          <>
                            <ArrowUpward sx={{ fontSize: "medium", mr: 1 }} />
                            Weight Gain Program Selected
                          </>
                        ) : (
                          <>
                            <ArrowDownward sx={{ fontSize: "medium", mr: 1 }} />
                            Weight Loss Program Selected
                          </>
                        )}
                      </Typography>
                      <Typography variant='caption'>
                        {" "}
                        <AccessAlarm sx={{ fontSize: "medium", mr: 1 }} />
                        {dayjs(goal.targetDate).diff(
                          dayjs(goal.createdDate),
                          "day"
                        )}{" "}
                        Days
                      </Typography>
                      <Typography variant='caption'>
                        {" "}
                        <Scale sx={{ fontSize: "medium", mr: 1 }} />
                        {goal.currentWeight} lbs{" "}
                        <Forward sx={{ fontSize: "medium" }} />{" "}
                        {goal.weightTarget} lbs
                      </Typography>
                      <Typography variant='caption'>
                        {goal.weightTarget > goal.currentWeight ? (
                          <>
                            <Add sx={{ fontSize: "medium", mr: 1 }} />
                            Calories {goal.dailyCalorieTarget}{" "}
                            <i>(daily surplus)</i>
                          </>
                        ) : (
                          <>
                            <Remove sx={{ fontSize: "medium", mr: 1 }} />
                            Calories {goal.dailyCalorieTarget}{" "}
                            <i>(daily deficit)</i>
                          </>
                        )}
                      </Typography>

                      <Typography variant='caption'>
                        {" "}
                        <Add sx={{ fontSize: "medium", mr: 1 }} />
                        Protein {goal.dailyProteinTarget}g <i>(0.8g/lbs)</i>
                      </Typography>
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 3 }} textAlign='right'>
                    {goal.status === "completed" ? (
                      <CheckCircle sx={{ color: "#4caf50" }} />
                    ) : (
                      <HourglassTop sx={{ color: "#ffa726" }} />
                    )}
                  </Grid2>
                </Grid2>
              </Box>
            ))}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={goalHistory.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Stack>
        </>
      )}
    </>
  );
}
