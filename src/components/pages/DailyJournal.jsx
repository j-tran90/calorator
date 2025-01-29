import { useEffect, useState } from "react";
import { Box, Divider, Grid, Stack, Typography, CircularProgress, IconButton } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../../config/Firebase";
import dayjs from "dayjs";

const boxStyles = {
  backgroundColor: "#f5f5f5",
  textAlign: "left",
  p: 2,
  height: "100px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  overflow: "hidden", // Prevent overflow when collapsed
};

const expandedBoxStyles = {
  ...boxStyles,
  height: "auto", // Allow the box to grow when expanded
  transition: "height 0.3s ease",
};

const iconButtonContainer = {
  display: "flex",
  justifyContent: "center", // Center the arrow
  alignItems: "center", // Align items vertically
  width: "100%", // Ensure it takes the full width
};

export default function DailyJournal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({}); // Track which food items are expanded

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset errors

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

  const handleExpandClick = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expansion for this specific food item
    }));
  };

  return (
    <>
      <Typography variant="h5">Today's Journal</Typography>
      <Stack divider={<Divider sx={{ bgcolor: "#d3d3d3", height: "1px" }} />} spacing={0}>
        {loading ? (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body2" sx={{ p: 2, textAlign: "center", color: "red" }}>
            {error}
          </Typography>
        ) : entries.length > 0 ? (
          entries.map((entry) => {
            const isExpanded = expandedItems[entry.id];
            const foodText = entry.food.length > 20 ? entry.food.slice(0, 20) + "..." : entry.food;

            return (
              <Box key={entry.id} sx={isExpanded ? expandedBoxStyles : boxStyles}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={2}>
                    <RestaurantIcon />
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {isExpanded ? entry.food : foodText}
                    </Typography>
                    <Typography variant="body2">Calories {entry.calories} kcal</Typography>
                    <Typography variant="body2">Protein {entry.protein}g</Typography>
                    {entry.food.length > 20 && (
                      <Box sx={iconButtonContainer}>
                        <IconButton onClick={() => handleExpandClick(entry.id)} size="small">
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={3} textAlign="right">
                    <Typography variant="body2">
                      {dayjs(entry.createdAt.toDate()).format("h:mm A")}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            );
          })
        ) : (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="body2" sx={{ color: "gray" }}>
              No entries for today. Let's add some food!
            </Typography>
          </Box>
        )}
      </Stack>
    </>
  );
}
