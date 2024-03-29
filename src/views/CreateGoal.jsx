import Goal from "../components/Goal";
import User from "../components/User";
import { useAuth } from "../contexts/AuthContext";

export default function CreateGoal() {
  const { currentUser } = useAuth(null);
  return (
    <>
      <User />
      <h2>Welcome, {currentUser.displayName || "Guest"}! </h2>
      <h2>Set your goals to get started</h2>
      <Goal />
    </>
  );
}
