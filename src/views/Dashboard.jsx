import Add from "../components/Add";
import Navigation from "../components/Navigation";
import Test from "../components/Test";
import User from "../components/User";
import useTracker from "../hooks/useTracker";
import { FaStar } from "react-icons/fa";

export default function Dashboard() {
  const { total, remain, sumEntry, updateTotal, goal } = useTracker(0);

  return (
    <>
      <User />
      <Navigation />
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

      <Test sumEntry={sumEntry} updateTotal={updateTotal} />
      <Add sumEntry={sumEntry} updateTotal={updateTotal} />
    </>
  );
}
