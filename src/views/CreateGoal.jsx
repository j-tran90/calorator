import Goal from "../components/Goal";
import User from "../components/User";
import { useAuth } from "../contexts/AuthContext";

export default function CreateGoal() {
  const { currentUser } = useAuth(null);
  return (
    <>
      <User />
      <h2>Hi, {currentUser.displayName || "Guest"}! </h2>
      <h2>Get started with your goals</h2>
      <Goal />
    </>
  );
}
