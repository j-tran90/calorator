import { db, auth } from "../../config/Firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  TablePagination,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";

export default function Targets() {
  const { uid } = auth.currentUser;
  const [goalHistory, setGoalHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch user's goal history from Firestore
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Paginate the goalHistory based on current page and rowsPerPage
  const paginatedData = goalHistory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant='h5' textAlign='center' mb={3}>
        Your Targets
      </Typography>
      <Box display='flex' justifyContent='center' mb={3}>
        <Button
          variant='contained'
          component={Link}
          to='/creategoal'
          sx={{
            backgroundColor: "#000",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Set New Target
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table aria-label='user targets table'>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#9999" }}>
              <TableCell>Daily (kcals)</TableCell>
              <TableCell>Daily Protein</TableCell>
              <TableCell>Weight Goal</TableCell>
              <TableCell>Start (mm/dd/yyyy)</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((showTargets) => (
              <TableRow key={showTargets.id}>
                <TableCell>{showTargets.dailyCalorieTarget}</TableCell>
                <TableCell>{showTargets.dailyProteinTarget} g</TableCell>
                <TableCell>{showTargets.weightTarget} lbs</TableCell>
                <TableCell>{formatDate(showTargets.createdDate)}</TableCell>
                <TableCell>{formatDate(showTargets.targetDate)}</TableCell>
                <TableCell>
                  {showTargets.status === "completed" ? (
                    <IconButton color='success' disabled>
                      <CheckIcon />
                    </IconButton>
                  ) : (
                    showTargets.status
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={goalHistory.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
