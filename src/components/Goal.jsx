import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/Firebase";
import { FcCheckmark } from "react-icons/fc";
import useTracker from "../hooks/useTracker";

export default function Goal() {
  const { uid } = auth.currentUser;
  const [calorieGoal, setCalorieGoal] = useState(0);
  const { goal, getGoal } = useTracker(0);
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
      .then(() => {
        document.getElementById("updateForm").value = "";
        document.getElementById("button").style.visibility = "hidden";
      })
      .then(() => {
        redirect("/profile", { replace: true });
      })
      .then(() => {
        getGoal();
      });
  };

  const disableButton = () => {
    if (document.getElementById("updateForm").value === "" || NaN || null) {
      document.getElementById("button").style.visibility = "hidden";
    } else {
      document.getElementById("button").style.visibility = "";
    }
  };

  return (
    <>
      <div className="column">Caloric: {goal}</div>
      <form id="" onSubmit={handleUpdate}>
        <div>
          <input
            required
            id="updateForm"
            type="number"
            min="499"
            max="9999"
            onKeyDown={(evt) =>
              ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
            }
            placeholder="Enter Calorie"
            onKeyUp={disableButton}
            style={{ width: "100px" }}
            onChange={(e) => {
              setCalorieGoal(e.target.value);
            }}
          ></input>
        </div>
        <button
          id="button"
          type="submit"
          style={{
            visibility: "hidden",
            color: "#fff",
          }}
        >
          Set <FcCheckmark />
        </button>
      </form>
    </>
  );
}
