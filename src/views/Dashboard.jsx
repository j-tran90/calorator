import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/Firebase";
import Add from "../components/Add";
import FoodButtons from "../components/FoodButtons";
import ProgressCircle from "../components/ProgressCircle";
import useTracker from "../hooks/useTracker";
import useFetchGoals from "../hooks/useFetchGoals";
import ProgressLegend from "../components/ProgressLegend";
import SearchBar from "../components/SearchBar";

export default function Dashboard() {
  const {
    total,
    remainingCalories,
    sumEntry,
    updateTotal,
    calorieTarget,
    percent,
  } = useTracker(0);
  const [isActive, setIsActive] = useState(false);
  const { proteinTarget, remainingDays } = useFetchGoals(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate("/searchresults", { state: { query } }); // Navigate to results page with the query
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
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/creategoal");
      }
    };

    checkUserData();
  }, [navigate]);

  return (
    <>
      <SearchBar
        placeholder='Search for food...'
        onSearch={handleSearch} // Pass the handleSearch function
      />

      <h3>{remainingDays} days left</h3>
      <ProgressCircle percent={percent} />
      <ProgressLegend total={total} remainingCalories={remainingCalories} />

      {/* <h3>
        <Link to="/journal">Total: {total}</Link> | Remaining:{" "}
        {remainingCalories}
      </h3> */}

      <h6>
        Calorie: {calorieTarget} | Protein: {proteinTarget}g
      </h6>

      <Add sumEntry={sumEntry} updateTotal={updateTotal} />
      <div className='accordion'>
        <div className='' onClick={() => setIsActive(!isActive)}>
          <div>
            Food Buttons
            <span style={{ float: "right" }}>{isActive ? "-" : "+"}</span>
          </div>
        </div>
        {isActive && (
          <div style={{ marginTop: "20px" }}>
            <FoodButtons sumEntry={sumEntry} updateTotal={updateTotal} />
          </div>
        )}
      </div>
    </>
  );
}
