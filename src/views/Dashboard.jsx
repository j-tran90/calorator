import Add from "../components/Add";
import FoodButtons from "../components/FoodButtons";
import Navigation from "../components/Navigation";
import ProgressCircle from "../components/ProgressCircle";
import User from "../components/User";
import useTracker from "../hooks/useTracker";

export default function Dashboard() {
  const { total, remain, sumEntry, updateTotal, goal, percent } = useTracker(0);

  return (
    <>
      <User />
      <Navigation />
      <ProgressCircle percent={percent} />
      <h3>
        Total: {total} | Remaining: {remain}
      </h3>
      <h6>Goal: {goal}</h6>
      <FoodButtons sumEntry={sumEntry} updateTotal={updateTotal} />
      <Add sumEntry={sumEntry} updateTotal={updateTotal} />
    </>
  );
}
