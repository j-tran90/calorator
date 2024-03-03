import Add from "../components/Add";
import Navigation from "../components/Navigation";
import Test from "../components/Test";
import User from "../components/User";
import useTracker from "../hooks/useTracker";
import { FaStar } from "react-icons/fa";

export default function Dashboard() {
  const { total, remain, sumEntry, updateTotal, goal, percent } = useTracker(0);

  return (
    <>
      <User />
      <Navigation />
      <h2>
        Total: {total} ({percent}%)
      </h2>
      {!remain <= 0 ? (
        <h3>Remaining: {remain}</h3>
      ) : (
        <h3>
          <FaStar style={{ color: "yellow" }} /> Goal Reached{" "}
          <FaStar style={{ color: "yellow" }} />
        </h3>
      )}

      <h5>Goal: {goal}</h5>

      <Test sumEntry={sumEntry} updateTotal={updateTotal} />
      <Add sumEntry={sumEntry} updateTotal={updateTotal} />
    </>
  );
}
