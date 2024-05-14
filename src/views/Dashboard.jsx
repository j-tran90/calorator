import { useState } from "react";
import Add from "../components/Add";
import FoodButtons from "../components/FoodButtons";
import Navigation from "../components/Navigation";
import ProgressCircle from "../components/ProgressCircle";
import User from "../components/User";
import useTracker from "../hooks/useTracker";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { total, remain, sumEntry, updateTotal, goal, percent } = useTracker(0);
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <User />
      <Navigation />
      <ProgressCircle percent={percent} />
      <h3>
        <Link to="/journal">Total: {total}</Link> | Remaining: {remain}
      </h3>

      <h6>Goal: {goal}</h6>
      <Add sumEntry={sumEntry} updateTotal={updateTotal} />
      <div className="accordion">
        <div className="" onClick={() => setIsActive(!isActive)}>
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
