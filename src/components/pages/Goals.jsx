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
import { getData, saveData } from "../../utils/indexedDB";

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

  // --- IndexedDB caching for goalHistory ---
  useEffect(() => {
    if (!uid) return;

    const fetchGoalHistory = async () => {
      setLoading(true);
      setError(null);

      // 1. Try to get cached data from IndexedDB
      const cachedDataObj = await getData(`goalHistory-${uid}`);
      const cachedData = cachedDataObj?.data || {};
      const lastKnownDate = cachedData.lastKnownDate
        ? dayjs(cachedData.lastKnownDate)
        : null;

      // 2. Get the most recent goal from Firestore
      const goalHistoryRef = collection(db, "userGoals", uid, "goalsHistory");
      const q = query(goalHistoryRef, orderBy("createdDate", "desc"));
      const querySnapshot = await getDocs(q);

      // Find the most recent createdDate in Firestore
      let mostRecentFirestoreDate = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdDate) {
          const docDate = dayjs(data.createdDate);
          if (
            !mostRecentFirestoreDate ||
            docDate.isAfter(mostRecentFirestoreDate)
          ) {
            mostRecentFirestoreDate = docDate;
          }
        }
      });

      // 3. If no new goals, use cached data
      if (
        lastKnownDate &&
        mostRecentFirestoreDate &&
        !mostRecentFirestoreDate.isAfter(lastKnownDate)
      ) {
        setGoalHistory(cachedData.goalHistory || []);
        setLoading(false);
        return;
      }

      // 4. Otherwise, fetch and cache new data
      try {
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
          return 0;
        });

        setGoalHistory(goalData);

        // Save to IndexedDB
        await saveData(`goalHistory-${uid}`, {
          goalHistory: goalData,
          lastKnownDate: mostRecentFirestoreDate
            ? mostRecentFirestoreDate.toISOString()
            : null,
        });
      } catch (error) {
        setError("Error fetching goal history. Please try again.");
        console.error("Error fetching goal history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalHistory();
  }, [uid]);

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
      <Grid2
        container
        alignItems='center'
        justifyContent='space-between'
        sx={{ m: 2, height: "50px" }}
      >
        <Grid2 size={{ xxs: 6 }}>
          <Header headText='Your Plans' />
        </Grid2>
        <Grid2
          size={{ xxs: 6 }}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <SetTargetButton buttonSize={40}/>
        </Grid2>
      </Grid2>

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
            sx={{ borderRadius: "20px", m: 1, p: { xxs: 1, md: 2 } }}
            divider={<Divider sx={{ bgcolor: "#d3d3d3", height: "1px" }} />}
            spacing={0}
          >
            {paginatedData.map((goal) => (
              <Box sx={boxStyles} key={goal.id}>
                <Grid2 container>
                  <Grid2 size={{ xxs: 9 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: "bold" }}>
                      {formatDate(goal.createdDate)} to{" "}
                      {formatDate(goal.targetDate)}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xxs: 3 }} textAlign='right'>
                    <Typography variant='caption' sx={{ fontStyle: "italic" }}>
                      {goal.status.charAt(0).toUpperCase() +
                        goal.status.slice(1)}
                    </Typography>
                  </Grid2>
                </Grid2>
                <Grid2 container alignItems='center'>
                  <Grid2 size={{ xxs: 9 }}>
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
                  <Grid2 size={{ xxs: 3 }} textAlign='right'>
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
