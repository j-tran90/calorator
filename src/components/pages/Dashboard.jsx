import useTracker from "../../hooks/useTracker";
import ProgressCircle from "../features/graphs/ProgressCircle";

export default function Dashboard() {
  const { proteinTotal } = useTracker(0);
  return (
    <>
      <h1>Dashboard</h1>
            <ProgressCircle percent={proteinTotal} gradientId='purple' isGram={true}/>
    </>
  );
}
