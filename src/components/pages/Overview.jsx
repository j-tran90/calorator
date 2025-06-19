import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/Firebase";
import { doc, getDoc } from "firebase/firestore"; // Import modular Firestore functions
import ProgressCircle from "../features/graphs/ProgressCircle";
import useTracker from "../../hooks/useTracker";
import useGoals from "../../hooks/useGoals";
import ProgressLegend from "../features/graphs/ProgressLegend";
import FoodCategoriesTabs from "../features/quickfood/FoodCategoriesTab";
import { Box, Card, Grid2, Paper, Typography } from "@mui/material";
import SetTargetButton from "../buttons/SetTargetButton";
import ProgressBar from "../features/graphs/ProgressBar";
import { FlagCircle } from "@mui/icons-material";
import LoadingScreen from "../layouts/LoadingScreen";
import { formatNutritionValue } from "../../utils/formatNutritionValue";

export default function Overview() {
  const {
    calorieTotal,
    calorieRemaning,
    caloriePercent,
    updateTotal,
    sumEntry,
    proteinTotal,
    sugarTotal,
    carbsTotal,
    fatsTotal,
  } = useTracker(0);
  const { proteinTarget, remainingDays, differenceInDays } = useGoals(0);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Start loading by default

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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Card
        sx={{
          borderRadius: "20px",
          m: 1,
          mb: 2,
          mt: 2,
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
                  right: 10, // Align to the far right
                  transform: "translateY(-50%)", // Only vertically center the element
                  fontWeight: "bold",
                }}
              >
                {remainingDays >= 0 ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {remainingDays}{" "}
                    <Typography variant='caption'>Days Left</Typography>{" "}
                    <FlagCircle />
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
          borderRadius: "20px",
          p: { xxs: 3, xs: 5 },
        }}
      >
        <Box onClick={handleClick}>
          <ProgressCircle
            value={caloriePercent}
            gradientId='greenYellow'
            isPercentage={true}
            targetValue={100}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", m: 2 }}>
          <Grid2
            sx={{ xxs: 12, md: 12 }}
            container
            rowSpacing={1}
            columnSpacing={2}
          >
            <Card
              sx={{
                border: "1px solid #9999",
                borderRadius: "20px",
                boxShadow: "none",
                p: 2,
              }}
            >
              <Typography variant='body2'>Consumed</Typography>
              <Typography variant='caption'>
                {formatNutritionValue(calorieTotal)}{" "}
              </Typography>
            </Card>
            <Card
              sx={{
                border: "1px solid #9999",
                borderRadius: "20px",
                boxShadow: "none",
                p: 2,
              }}
            >
              <Typography variant='body2'>Remaining</Typography>
              <Typography variant='caption'>
                {formatNutritionValue(calorieRemaning)}{" "}
              </Typography>
            </Card>
          </Grid2>
        </Box>

        {/* Macros Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #9999",
            borderRadius: "12px",
            overflow: "hidden",
            mt: 3,
            mb: 2,
          }}
        >
          {/* Protein */}
          <Box sx={{ flex: 1, textAlign: "center", py: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: "bold" }}>
              Protein
            </Typography>
            <Typography variant='caption'>
              {formatNutritionValue(proteinTotal)}
            </Typography>
          </Box>
          {/* Divider */}
          <Box sx={{ width: "1px", bgcolor: "#9999", height: "40px" }} />
          {/* Sugar */}
          <Box sx={{ flex: 1, textAlign: "center", py: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: "bold" }}>
              Sugar
            </Typography>
            <Typography variant='caption'>
              {formatNutritionValue(sugarTotal)}
            </Typography>
          </Box>
          <Box sx={{ width: "1px", bgcolor: "#9999", height: "40px" }} />
          {/* Carbs */}
          <Box sx={{ flex: 1, textAlign: "center", py: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: "bold" }}>
              Carbs
            </Typography>
            <Typography variant='caption'>
              {formatNutritionValue(carbsTotal)}
            </Typography>
          </Box>
          <Box sx={{ width: "1px", bgcolor: "#9999", height: "40px" }} />
          {/* Fats */}
          <Box sx={{ flex: 1, textAlign: "center", py: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: "bold" }}>
              Fats
            </Typography>
            <Typography variant='caption'>
              {formatNutritionValue(fatsTotal)}
            </Typography>
          </Box>
        </Box>
      </Card>
      <FoodCategoriesTabs updateTotal={updateTotal} sumEntry={sumEntry} />
    </>
  );
}
