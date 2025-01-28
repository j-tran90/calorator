import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../config/Firebase";
import ProgressCircle from "../features/graphs/ProgressCircle";
import useTracker from "../../hooks/useTracker";
import useFetchGoals from "../../hooks/useFetchGoals";
import ProgressLegend from "../features/graphs/ProgressLegend";
import SearchBar from "../features/search/SearchBar";
import FoodCategoriesTabs from "../features/quickfood/FoodCategoriesTab";
import { Card, Typography } from "@mui/material";

export default function Today() {
  // Use useTracker to manage total and trigger re-renders when total updates
  const {
    calorieTotal,
    calorieRemaning,
    caloriePercent,
    updateTotal,
    sumEntry,
  } = useTracker(0);
  const { proteinTarget, remainingDays, SetNewTargetsButton } =
    useFetchGoals(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(null);
  const navigate = useNavigate();

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
      <h3>{remainingDays} days left</h3>
      {SetNewTargetsButton()}
      <Card
        sx={{
          m: 1,
          border: "1px solid #9999",
          borderRadius: "15px",
          bgcolor: "",
          p: 6,
          boxShadow: "none",
        }}
      >
        <Typography variant='h5'>Calories</Typography>
        <ProgressCircle
          value={caloriePercent}
          gradientId='greenYellow'
          isPercentage={true}
          targetValue={100}
        />
        <ProgressLegend total={calorieTotal} remaining={calorieRemaning} />
        <h6>
          Calorie: {dailyCalorieTarget} | Protein: {proteinTarget}g
        </h6>
      </Card>
      <FoodCategoriesTabs updateTotal={updateTotal} sumEntry={sumEntry} />
    </>
  );
}
