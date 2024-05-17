import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/Firebase";
import { collection, documentId, query, where } from "firebase/firestore";
import User from "../components/User";
import useCollectionData from "../hooks/useFetch";
import Navigation from "../components/Navigation";
import { DarkModeToggle } from "../contexts/DarkModeContext";
import Targets from "../components/Targets";

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
      <User />
      <Navigation />
      <div className="card">
        <div style={{ textAlign: "left" }}>
          <div className="column">
            Name: {currentUser.displayName || "Guest User"}
          </div>

          {profile.map((showProfile) => {
            return (
              <div key={showProfile.id}>
                <div className="column">
                  <div className="column">Age: {showProfile.age}</div>
                  <div>Gender: {showProfile.gender}</div>
                  Current Weight: {showProfile.currentWeight} lbs
                </div>
                <div>Height: {showProfile.height}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="accordion">
        <div className="" id="goal" onClick={() => setIsGoal(!isGoal)}>
          <div>
            Targets <span style={{ float: "right" }}>{isGoal ? "-" : "+"}</span>
          </div>
        </div>
        {isGoal && (
          <div style={{ marginTop: "20px" }}>
            {" "}
            <Targets />
          </div>
        )}
      </div>

      <div className="accordion">
        <div className="" id="account" onClick={() => setIsAccount(!isAccount)}>
          <div>
            Account
            <span style={{ float: "right" }}>{isAccount ? "-" : "+"}</span>
          </div>
        </div>
        {isAccount && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ textAlign: "left" }}>
              <div>Email: {currentUser.email || "N/A"}</div>
            </div>
          </div>
        )}
      </div>
      <div className="accordion">
        <div
          className=""
          id="settings"
          onClick={() => setIsSettings(!isSettings)}
        >
          <div>
            Settings
            <span style={{ float: "right" }}>{isSettings ? "-" : "+"}</span>
          </div>
        </div>
        {isSettings && (
          <div style={{ marginTop: "20px" }}>
            <div>
              <DarkModeToggle />
            </div>
          </div>
        )}
      </div>

      <div>
        <button title="Logout" onClick={handleLogout}>
          Logout
        </button>
        <button
          title="Disabled"
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
