import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../config/Firebase";
import ProgressCircle from "../features/graphs/ProgressCircle";
import useTracker from "../../hooks/useTracker";
import useFetchGoals from "../../hooks/useFetchGoals";
import ProgressLegend from "../features/graphs/ProgressLegend";
import FoodCategoriesTabs from "../features/quickfood/FoodCategoriesTab";
import { Box, Card, Grid2, Typography } from "@mui/material";
import SetTargetButton from "../buttons/SetTargetButton";
import ProgressBar from "../features/graphs/ProgressBar";

export default function Overview() {
  // Use useTracker to manage total and trigger re-renders when total updates
  const {
    calorieTotal,
    calorieRemaning,
    caloriePercent,
    updateTotal,
    sumEntry,
    proteinTotal,
  } = useTracker(0);
  const { proteinTarget, remainingDays, differenceInDays } = useFetchGoals(0);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(null);
  const navigate = useNavigate();

  //PLACEHOLDER DELETE WHEN REPLACE
  const placeholder1 = 10;
  const placeholder2 = 55;
  const placeholder3 = 33;

  const handleClick = () => {
    navigate("/today");
  };

  useEffect(() => {
    const checkUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const userGoalsRef = db.collection("userGoals").doc(user.uid);
      const userProfileRef = db.collection("userProfile").doc(user.uid);

      try {
        const [userGoalsDoc, userProfileDoc] = await Promise.all([
          userGoalsRef.get(),
          userProfileRef.get(),
        ]);

        if (!userGoalsDoc.exists || !userProfileDoc.exists) {
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
          navigate("/creategoal");
          return;
        }
        setDailyCalorieTarget(userGoalsData.dailyCalorieTarget);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/creategoal");
      }
    };

    checkUserData();
  }, [navigate]);

  return (
    <>
      <Card
        sx={{
          m: 1,
          border: "1px solid #9999",
          borderRadius: "20px",
          bgcolor: "",
          p: 0,
          boxShadow: "none",
        }}
      >
        {" "}
        <Typography variant='h5'>
          {remainingDays >= 0 ? (
            <ProgressBar
              barHeight={30}
              barWidth={100}
              barHeading={`${remainingDays} Days to Deadline`}
              currentValue={differenceInDays - remainingDays}
              targetValue={differenceInDays}
            />
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
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 6 }}>
            <ProgressBar
              gradientType='yellowGreen'
              barHeading={`Sugar`}
              barHeight={10}
              currentValue={placeholder1}
              targetValue={proteinTarget}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 6 }}>
            <ProgressBar
              gradientType='orangeRed'
              barHeading={"Carbs"}
              barHeight={10}
              currentValue={placeholder2}
              targetValue={proteinTarget}
            />
          </Grid2>
          <Grid2 size={{ xs: 6, md: 6 }}>
            <ProgressBar
              gradientType='lightBlueBlue'
              barHeading={`Fats`}
              barHeight={10}
              currentValue={placeholder3}
              targetValue={proteinTarget}
            />
          </Grid2>
        </Grid2>
      </Card>
      <FoodCategoriesTabs updateTotal={updateTotal} sumEntry={sumEntry} />
    </>
  );
}
