import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../config/Firebase";
import { collection, documentId, query, where } from "firebase/firestore";
import Goal from "../components/Goal";
import User from "../components/User";
import { FcHighPriority, FcLock } from "react-icons/fc";
import { AiFillEdit } from "react-icons/ai";
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
  const [isGoal, setIsGoal] = useState(false);
  const [isAccount, setIsAccount] = useState(false);

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
                  Current Weight: {showProfile.weight} lbs
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="accordion">
        <div className="" id="goal" onClick={() => setIsGoal(!isGoal)}>
          <div>
            Goals <span style={{ float: "right" }}>{isGoal ? "-" : "+"}</span>
          </div>
        </div>
        {isGoal && (
          <div style={{ marginTop: "20px" }}>
            <Goal />
          </div>
        )}
      </div>

      <div className="accordion">
        <div className="" id="account" onClick={() => setIsAccount(!isAccount)}>
          <div>
            Account{" "}
            <span style={{ float: "right" }}>{isAccount ? "-" : "+"}</span>
          </div>
        </div>
        {isAccount && (
          <div style={{ marginTop: "20px" }}>
            <div className="column">Email: {currentUser.email || "N/A"}</div>
          </div>
        )}
      </div>

      <div>
        <button title="Logout" onClick={handleLogout}>
          Logout <FcLock />
        </button>
        <button
          title="Disabled"
          onClick={deleteAccount}
          style={{ color: "#999", backgroundColor: "#555" }}
          disabled
        >
          Delete Account <FcHighPriority />
        </button>
      </div>
    </>
  );
}
