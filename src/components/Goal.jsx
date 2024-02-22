import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/Firebase";
import { FcCheckmark } from "react-icons/fc";
import useGoals from "../hooks/useGoals";

export default function Goal() {
  const { uid } = auth.currentUser;
  const [calorieGoal, setCalorieGoal] = useState(0);
  const { goal, getGoal } = useGoals(0);
  //const [error, setError] = useState("");
  const redirect = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();

    await db
      .collection("goals")
      .doc(uid)
      .set({
        calorieGoal: parseFloat(calorieGoal),
      })
      .then(function () {
        document.getElementById("updateForm").reset();
      })
      .then(() => {
        redirect("/profile", { replace: true });
      })
      .then(() => {
        getGoal();
      });
  };

  const disableButton = () => {
    if (document.getElementById("updateForm").value === " " || NaN || null) {
      document.getElementById("button").disabled = true;
    } else {
      document.getElementById("button").disabled = false;
    }
  };

  return (
    <>
      <h2>Goals</h2>
      <div className="column">Caloric: {goal}</div>
      <form id="updateForm" onSubmit={handleUpdate}>
        <div>
          <input
            required
            id="calorieGoal"
            type="number"
            placeholder="Enter Calorie Goal"
            onKeyUp={disableButton}
            onChange={(e) => {
              setCalorieGoal(e.target.value);
            }}
          ></input>
        </div>
        <button id="button" type="submit" disabled>
          Set <FcCheckmark />
        </button>
      </form>
    </>
  );
}
