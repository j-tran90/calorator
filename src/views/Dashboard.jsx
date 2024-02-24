import Add from "../components/Add";
import User from "../components/User";
import useGoals from "../hooks/useGoals";
import useTracker from "../hooks/useTracker";
import { FaStar } from "react-icons/fa";

export default function Dashboard() {
  const { goal } = useGoals();
  const { total, remain, sumEntry, updateTotal } = useTracker(0);

  return (
    <>
      <User />
      <h1>Total: {total}</h1>
      {!remain <= 0 ? (
        <h2>Remaining: {remain}</h2>
      ) : (
        <h2>
          <FaStar style={{ color: "yellow" }} /> Goal Reached{" "}
          <FaStar style={{ color: "yellow" }} />
        </h2>
      )}

      <h3>Goal: {goal}</h3>

      <Add sumEntry={sumEntry} updateTotal={updateTotal} />
    </>
  );
}
