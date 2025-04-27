import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/Firebase";
import { doc, getDoc } from "firebase/firestore"; // Import modular Firestore functions
import ProgressCircle from "../features/graphs/ProgressCircle";
import useTracker from "../../hooks/useTracker";
import useGoals from "../../hooks/useGoals";
import ProgressLegend from "../features/graphs/ProgressLegend";
import FoodCategoriesTabs from "../features/quickfood/FoodCategoriesTab";
import { Box, Card, Grid2, Typography } from "@mui/material";
import SetTargetButton from "../buttons/SetTargetButton";
import ProgressBar from "../features/graphs/ProgressBar";
import { FlagCircle } from "@mui/icons-material";
import LoadingScreen from "../layouts/LoadingScreen";

export default function Overview() {
  const {
    calorieTotal,
    calorieRemaning,
    caloriePercent,
    updateTotal,
    sumEntry,
    proteinTotal,
  } = useTracker(0);
  const { proteinTarget, remainingDays, differenceInDays } = useGoals(0);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Start loading by default
  const [placeholder1, setPlaceholder1] = useState(0); // For sugar
  const [placeholder2, setPlaceholder2] = useState(0); // For carbs
  const [placeholder3, setPlaceholder3] = useState(0); // For fats

  const handleClick = () => {
    navigate("/today");
  };

  useEffect(() => {
    const checkUserData = async () => {
      const uid = auth.currentUser?.uid;
      if (!auth.currentUser) {
        navigate("/login");
        return;
      }

      // Use modular Firestore syntax
      const userGoalsRef = doc(db, "userGoals", uid);
      const userProfileRef = doc(db, "userProfile", uid);

      try {
        // Fetch both documents using getDoc
        const [userGoalsDoc, userProfileDoc] = await Promise.all([
          getDoc(userGoalsRef),
          getDoc(userProfileRef),
        ]);

        if (!userGoalsDoc.exists() || !userProfileDoc.exists()) {
          // Show loading screen and redirect to /creategoal
          setLoading(true);
          navigate("/creategoal");
          return;
        }

        const userGoalsData = userGoalsDoc.data();
        const userProfileData = userProfileDoc.data();

        if (
          !userGoalsData ||
          !userProfileData ||
          !userGoalsData.dailyCalorieTarget
        ) {
          // Show loading screen and redirect to /creategoal
          setLoading(true);
          navigate("/creategoal");
          return;
        }

        setDailyCalorieTarget(userGoalsData.dailyCalorieTarget);
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(true); // Show loading screen if there's an error and navigate to /creategoal
        navigate("/creategoal");
      }
    };

    checkUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const sugar = 50; // Example value
        const carbs = 200; // Example value
        const fats = 70; // Example value

        setPlaceholder1(sugar);
        setPlaceholder2(carbs);
        setPlaceholder3(fats);
      } catch (error) {
        console.error("Error fetching additional data:", error);
      }
    };

    fetchAdditionalData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Card
        sx={{
          border: "1px solid #9999",
          borderRadius: "20px",
          m: 1,
          boxShadow: "none",
        }}
      >
        <Typography variant='h7'>
          {remainingDays >= 0 ? (
            <Box sx={{ position: "relative" }}>
              <ProgressBar
                barHeight={30}
                barWidth={100}
                currentValue={differenceInDays - remainingDays}
                targetValue={differenceInDays}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontWeight: "bold",
                }}
              >
                {remainingDays >= 0 ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {remainingDays} Days Remaining <FlagCircle />
                  </Box>
                ) : (
                  "No Target Set"
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <SetTargetButton buttonText={"Set A New Target"} />
            </Box>
          )}
        </Typography>
      </Card>

      <Card
        sx={{
          m: 1,
          border: "1px solid #9999",
          borderRadius: "20px",
          bgcolor: "",
          p: { xs: 3, md: 5 },
          boxShadow: "none",
        }}
      >
        <Typography variant='h5' gutterBottom>
          Calories
        </Typography>

        <Box onClick={handleClick}>
          <ProgressCircle
            value={caloriePercent}
            gradientId='greenYellow'
            isPercentage={true}
            targetValue={100}
          />
        </Box>
        <ProgressLegend total={calorieTotal} remaining={calorieRemaning} />
        <Grid2 container rowSpacing={1} columnSpacing={{ xs: 4, md: 10 }}>
          <Grid2 size={{ xs: 6, md: 6 }}>
            <ProgressBar
              gradientType='purple'
              barHeading={`Protein ${proteinTotal}/${proteinTarget}g`}
              barHeight={10}
              currentValue={proteinTotal}
              targetValue={proteinTarget}
              marginTop={2}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 6 }}>
            <ProgressBar
              gradientType='yellowGreen'
              barHeading={`Sugar (WIP)`}
              barHeight={10}
              currentValue={placeholder1}
              targetValue={proteinTarget}
              marginTop={2}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 6 }}>
            <ProgressBar
              gradientType='orangeRed'
              barHeading={"Carbs (WIP)"}
              barHeight={10}
              currentValue={placeholder2}
              targetValue={proteinTarget}
              marginTop={2}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 6 }}>
            <ProgressBar
              gradientType='lightBlueBlue'
              barHeading={`Fats (WIP)`}
              barHeight={10}
              currentValue={placeholder3}
              targetValue={proteinTarget}
              marginTop={2}
            />
          </Grid2>
        </Grid2>
      </Card>
      <FoodCategoriesTabs updateTotal={updateTotal} sumEntry={sumEntry} />
    </>
  );
}
