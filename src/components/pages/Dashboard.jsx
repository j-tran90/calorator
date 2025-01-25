import useTracker from "../../hooks/useTracker";

export default function Dashboard() {
  const { totalProtein } = useTracker(0);
  return (
    <>
      <h1>Dashboard</h1>
      {totalProtein}
    </>
  );
}
