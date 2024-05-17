import { db, auth } from "../config/Firebase";
import { collection, documentId, query, where } from "firebase/firestore";
import useCollectionData from "../hooks/useFetch";
import { Link } from "react-router-dom";

export default function Targets() {
  const { uid } = auth.currentUser;
  const userGoalsRef = collection(db, "userGoals/");
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
    <>
      {targets.map((showTargets) => {
        return (
          <div
            key={showTargets.id}
            style={{ textAlign: "left", marginTop: "20px" }}
          >
            <div>Daily Calories: {showTargets.dailyCalorieTarget}</div>
            <div>Daily Protein: {showTargets.dailyProteinTarget}</div>
            <div> Weight Goal: {showTargets.weightTarget} lbs</div>
            <div>Target Date: {formatDate(showTargets.targetDate)}</div>
          </div>
        );
      })}
      <button style={{ marginTop: "20px" }}>
        <Link to="/creategoal"> Set New Targets</Link>
      </button>
    </>
  );
}
