import { db, auth } from "../../config/Firebase";
import { collection, documentId, query, where } from "firebase/firestore";
import useCollectionData from "../../hooks/useFetch";
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
} from "@mui/material";

export default function Targets() {
  const { uid } = auth.currentUser;
  const userGoalsRef = collection(db, "userGoals");
  const queryUserGoals = query(userGoalsRef, where(documentId(), "==", uid));
  const { data: targets } = useCollectionData(queryUserGoals);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" textAlign="center" mb={3}>
        Your Targets
      </Typography>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table aria-label="user targets table">
          <TableHead>
            <TableRow>
              <TableCell>Daily Calories</TableCell>
              <TableCell>Daily Protein</TableCell>
              <TableCell>Weight Goal (lbs)</TableCell>
              <TableCell>Target Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {targets.map((showTargets) => (
              <TableRow key={showTargets.id}>
                <TableCell>{showTargets.dailyCalorieTarget}</TableCell>
                <TableCell>{showTargets.dailyProteinTarget}</TableCell>
                <TableCell>{showTargets.weightTarget}</TableCell>
                <TableCell>{formatDate(showTargets.targetDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          component={Link}
          to="/creategoal"
          sx={{
            backgroundColor: "#000",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Set New Targets
        </Button>
      </Box>
    </Box>
  );
}
