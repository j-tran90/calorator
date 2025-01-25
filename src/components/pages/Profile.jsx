import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db, auth } from "../../config/Firebase";
import { collection, documentId, query, where } from "firebase/firestore";
import useCollectionData from "../../hooks/useFetch";
import dayjs from "dayjs";

export default function Profile() {
  const { currentUser } = useAuth();
  const { uid } = auth.currentUser;
  
  // Query user profile
  const userProfileRef = collection(db, "userProfile/");
  const queryUserProfile = query(userProfileRef, where(documentId(), "==", uid));
  const { data: profile } = useCollectionData(queryUserProfile);
  
  // Query user goals to fetch currentWeight
  const userGoalsRef = collection(db, "userGoals");
  const queryUserGoals = query(userGoalsRef, where(documentId(), "==", uid));
  const { data: goals } = useCollectionData(queryUserGoals);
  
  const [age, setAge] = useState(0); // Calculated age in years
  const [currentWeight, setCurrentWeight] = useState(null);

  function calculateAge(dateOfBirth) {
    const currentDate = new Date();
    const ageInMilliseconds = currentDate - new Date(dateOfBirth);
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 3600 * 24 * 365.25));
    return ageInYears;
  }

  useEffect(() => {
    if (profile && profile.length > 0) {
      const calculatedAge = calculateAge(profile[0].dob);
      setAge(calculatedAge);
    }
  }, [profile]); // Recalculate age when profile data changes

  useEffect(() => {
    if (goals && goals.length > 0) {
      setCurrentWeight(goals[0].currentWeight); // Set the currentWeight from userGoals
    }
  }, [goals]); // Update currentWeight when goals data changes

  return (
    <>
      <div className="card">
        <div style={{ textAlign: "left" }}>
          <div className="column">
            Name: {currentUser.displayName || "Guest User"}
          </div>

          {profile.map((showProfile) => (
            <div key={showProfile.id}>
              <div className="column">
                <div className="column">
                  Age: {age} {/* Display calculated age */}
                </div>
                <div>
                  Date of Birth: {dayjs(showProfile.dob).format("MM/DD/YYYY")}
                </div>{" "}
                {/* Display formatted DOB */}
                <div>Gender: {showProfile.gender}</div>
                <div>Current Weight: {currentWeight} lbs</div> {/* Display current weight from userGoals */}
              </div>
              <div>Height: {showProfile.height} cm</div>
              <div>Joined: {dayjs(showProfile.joinDate).format("MM/DD/YYYY")}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
