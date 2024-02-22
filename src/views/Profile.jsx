import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/Firebase";
import { collection, documentId, query, where } from "firebase/firestore";
import Goal from "../components/Goal";
import User from "../components/User";
import { FcHighPriority, FcLock } from "react-icons/fc";
import useCollectionData from "../hooks/useFetch";
import Navigation from "../components/Navigation";

export default function Profile() {
  const { currentUser, logout, deleteAccount } = useAuth();
  const { uid } = auth.currentUser;
  const userCollectionRef = collection(db, "users/");
  const querySnapshot = query(
    userCollectionRef,
    where(documentId(), "==", uid)
  );
  const { data: profile } = useCollectionData(querySnapshot);
  const [error, setError] = useState("");
  const redirect = useNavigate();

  async function handleLogout() {
    setError(error);

    try {
      await logout();
      redirect("/", { replace: true });
    } catch {
      setError("Failed to logout");
    }
  }

  return (
    <>
      <User />
      <Navigation />
      <hr />
      <div className="column">Email: {currentUser.email || "N/A"}</div>
      <div className="column">
        Name: {currentUser.displayName || "Guest User"}
      </div>
      {profile.map((showProfile) => {
        return (
          <div key={showProfile.id}>
            <div className="column">Weight: {showProfile.weight} lbs</div>
            <div className="column">Age: {showProfile.age}</div>
          </div>
        );
      })}
      <hr />
      <Goal />
      <hr />
      <button onClick={handleLogout} style={{ marginRight: "20px" }}>
        Logout <FcLock />
      </button>
      <button onClick={deleteAccount} style={{ color: "red" }}>
        Delete Account <FcHighPriority />
      </button>
    </>
  );
}
