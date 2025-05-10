import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Grid2,
  Stack,
  Typography,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import {
  Restaurant,
  LocalBar,
  Icecream,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../../config/Firebase";
import dayjs from "dayjs";
import Header from "../navigation/Header";
import useTracker from "../../hooks/useTracker";
import ProgressBar from "../features/graphs/ProgressBar";

const boxStyles = {
  //backgroundColor: "#f5f5f5",
  textAlign: "left",
  p: 2,
  height: "100px",
  borderRadius: "8px",
  //boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
};

const expandedBoxStyles = {
  ...boxStyles,
  height: "auto",
  transition: "height 0.3s ease",
};

const categoryIcons = {
  main: <Restaurant />,
  drink: <LocalBar />,
  dessert: <Icecream />,
};

export default function Today() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const { caloriePercent } = useTracker(0);

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const uid = auth.currentUser?.uid;

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

  const handleExpandClick = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <Grid2
        container
        alignItems='center'
        justifyContent='space-between'
        sx={{ m: 2, height: "50px" }}
      >
        <Grid2 size={{ xxs: 8 }}>
          <Header headText='Today' />
        </Grid2>
        <Grid2
          size={{ xxs: 4 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            textAlign: "right",
          }}
        >
          <ProgressBar
            currentValue={caloriePercent}
            targetValue={100}
            barHeading={"Progress"}
          />
        </Grid2>
      </Grid2>

      <Stack
        divider={<Divider sx={{ bgcolor: "#d3d3d3", height: "1px" }} />}
        spacing={0}
      >
        {loading ? (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography
            variant='body2'
            sx={{ p: 2, textAlign: "center", color: "red" }}
          >
            {error}
          </Typography>
        ) : entries.length > 0 ? (
          entries.map((entry) => {
            const isExpanded = expandedItems[entry.id];
            const foodCategory = entry.category || "food";

            // Dynamic food text length based on screen size
            const maxLength = isMd ? 90 : 20;
            const foodText =
              entry.food.length > maxLength
                ? entry.food.slice(0, maxLength) + "..."
                : entry.food;

            return (
              <Box
                key={entry.id}
                sx={isExpanded ? expandedBoxStyles : boxStyles}
              >
                <Grid2 container alignItems='center' spacing={2}>
                  <Grid2 size={{ xxs: 2, md: 1 }}>
                    {categoryIcons[foodCategory] || <Restaurant />}
                  </Grid2>

                  <Grid2 size={{ xxs: 7 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: "bold" }}>
                      {isExpanded ? entry.food : foodText}
                    </Typography>
                    <Box>
                      {" "}
                      <Typography variant='caption'>
                        Calories {entry.calories} kcal
                      </Typography>
                    </Box>
                    <Box>
                      {" "}
                      <Typography variant='caption'>
                        Protein {entry.protein}g
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 size={{ xxs: 3 }} textAlign='right'>
                    <Typography variant='caption'>
                      {dayjs(entry.createdAt.toDate()).format("h:mm A")}
                    </Typography>
                    {entry.food.length > maxLength && (
                      <Box>
                        <IconButton
                          onClick={() => handleExpandClick(entry.id)}
                          size='small'
                        >
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    )}
                  </Grid2>
                </Grid2>
              </Box>
            );
          })
        ) : (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Typography variant='body2' sx={{ color: "gray" }}>
              No entries for today. Let's add some food!
            </Typography>
          </Box>
        )}
      </Stack>
    </>
  );
}
