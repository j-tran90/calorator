import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../config/Firebase";
import ProgressCircle from "../features/graphs/ProgressCircle";
import useTracker from "../../hooks/useTracker";
import useFetchGoals from "../../hooks/useFetchGoals";
import ProgressLegend from "../features/graphs/ProgressLegend";
import SearchBar from "../features/search/SearchBar";
import FoodCategoriesTabs from "../features/quickfood/FoodCategoriesTab";

export default function Dashboard() {
  // Use useTracker to manage total and trigger re-renders when total updates
  const { total, remainingCalories, percent, updateTotal, sumEntry } =
    useTracker(0);
  const { proteinTarget, remainingDays } = useFetchGoals(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(null);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate("/searchresults", { state: { query } });
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
      <SearchBar placeholder='Search for food...' onSearch={handleSearch} />
      <h3>{remainingDays} days left</h3>
      <ProgressCircle percent={percent} />
      <ProgressLegend total={total} remainingCalories={remainingCalories} />
      <h6>
        Calorie: {dailyCalorieTarget} | Protein: {proteinTarget}g
      </h6>
      <FoodCategoriesTabs updateTotal={updateTotal} sumEntry={sumEntry} />
    </>
  );
}
