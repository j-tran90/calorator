import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../config/Firebase";
import { collection, documentId, query, where } from "firebase/firestore";
import User from "../User";
import useCollectionData from "../../hooks/useFetch";
import Navigation from "../navigation/NavBar";
import { DarkModeToggle } from "../../contexts/DarkModeContext";
import Targets from "../Targets";

export default function Profile() {
  const { currentUser, logout, deleteAccount } = useAuth();
  const { uid } = auth.currentUser;
  const userProfileRef = collection(db, "userProfile/");
  const queryUserProfile = query(
    userProfileRef,
    where(documentId(), "==", uid)
  );
  const { data: profile } = useCollectionData(queryUserProfile);

  const [error, setError] = useState("");
  const redirect = useNavigate();
  const [isGoal, setIsGoal] = useState(false);
  const [isAccount, setIsAccount] = useState(false);
  const [isSettings, setIsSettings] = useState(false);

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
      <div className='card'>
        <div style={{ textAlign: "left" }}>
          <div className='column'>
            Name: {currentUser.displayName || "Guest User"}
          </div>

          {profile.map((showProfile) => {
            return (
              <div key={showProfile.id}>
                <div className='column'>
                  <div className='column'>Age: {showProfile.age}</div>
                  <div>Gender: {showProfile.gender}</div>
                  Current Weight: {showProfile.currentWeight} lbs
                </div>
                <div>Height: {showProfile.height} cm</div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <button title='Logout' onClick={handleLogout}>
          Logout
        </button>
        <button
          title='Disabled'
          onClick={deleteAccount}
          style={{ color: "#999", backgroundColor: "#555" }}
          disabled
        >
          Delete Account
        </button>
      </div>
    </>
  );
}
